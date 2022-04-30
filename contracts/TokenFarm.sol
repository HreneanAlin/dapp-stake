//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

/**
stake tokens
unStake token
issue Tokens
add allowed tokens
get ETH value
 */
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniquesTokenStaked;
    mapping(address => address) public tokenPriceFeedMapping;

    address[] public allowedTokens;
    address[] public stakers;
    IERC20 public dappToken;

    // 100 ETH 1:1 for every 1 ETH, we give 1 DappToken
    // 50 ETH and 50 DAI staked, we want to give a reward of 1 DAPP / 1 DAI
    constructor(address _dappTokenAddress) public {
        dappToken = IERC20(_dappTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 userTotalValue = getUserTotalValue(recipient);
            //send them a token reward based on their value locked
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        require(uniquesTokenStaked[_user] > 0, "No tokens staked");
        uint256 totalValue = 0;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(_user, allowedTokens[i]);
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        if (uniquesTokenStaked[_user] <= 0) {
            return 0;
        }
        // price of the token * stakingBalance[_token][user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);

        return ((stakingBalance[_token][_user] * price) / (10**decimals));
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        //pricefeedAddress
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function stakeTokens(uint256 _amount, address _token) public payable {
        // what tokens can they stake?
        // how much can they stake?
        require(_amount > 0, "Amount must be more than 0");
        require(tokenIsAllowed(_token), "Token not allowed");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;
        if (uniquesTokenStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unstakeToken(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniquesTokenStaked[msg.sender] = uniquesTokenStaked[msg.sender] - 1;
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniquesTokenStaked[_user] = uniquesTokenStaked[_user] + 1;
        }
    }

    function tokenIsAllowed(address _token) public view returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == _token) {
                return true;
            }
        }
        return false;
    }

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }
}
