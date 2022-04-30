from brownie import accounts, network, config, MockV3Aggregator, Contract,  CiobanToken, DaiM

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]
FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork"]

contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "fau_token": DaiM,
    "cioban_token": CiobanToken

}
DECIMALS = 18
INITIAL_VALUE = 200_000_000_000
INITIAL_PRICE_FEED_VALUE = 2000 * 10**18


def get_account(index=None, id=None):
    # accounts[0] ganache
    # accounts.add('env') load address from env variable
    # accounts.load('id') load address from brownie accounts
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONMENTS
    ):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


def deploy_mocks(decimals=DECIMALS, initial_value=INITIAL_PRICE_FEED_VALUE):
    account = get_account()
    MockV3Aggregator.deploy(decimals, initial_value, {"from": account})
    print("deploying mock DAI...")
    dai_token = DaiM.deploy(1000, {"from": account})
    print(f"deployed to {dai_token.address}")
    print("Deploying Cioban Token mock")
    cioban_token = CiobanToken.deploy(1000, {"from": account})
    print(f"deployed to {cioban_token.address}")
    print("Deployed mocks")


def get_contract(contract_name):
    """
    this function will grap the contract from the
    brownie config if defined or it will deploy a mock version
    """
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active(
        )][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract
