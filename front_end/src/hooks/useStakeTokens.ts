import { useContractFunction, useEthers } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import tokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/dependencies/OpenZeppelin/openzeppelin-contracts@4.5.0/ERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { useEffect, useState } from "react"
import { TokenFarmContract } from "../contracts/TokenFarmContract"

export const useStakeTokens = (tokenAddress: string) => {
  const { chainId } = useEthers()
  const tokenFarmAddress = chainId
    ? networkMapping[String(chainId)]["TokenFarm"][0]
    : constants.AddressZero

  const tokenFarmContract = TokenFarmContract(chainId)

  const erc20ABI = ERC20.abi
  const erc20Interface = new utils.Interface(erc20ABI)
  const erc20Contract = new Contract(tokenAddress, erc20Interface)
  const { send: approveErc20Send, state: approveErc20State } =
    useContractFunction(erc20Contract, "approve", {
      transactionName: "Approve erc20 transfer",
    })

  const { send: stakeSend, state: stakeState } = useContractFunction(
    tokenFarmContract,
    "stakeTokens",
    {
      transactionName: "Stake tokens",
    }
  )

  const [amountToStake, setAmountToStake] = useState("0")
  const approveAndStake = (amount: string) => {
    setAmountToStake(amount)
    return approveErc20Send(tokenFarmAddress, amount)
  }

  useEffect(() => {
    if (approveErc20State.status === "Success") {
      stakeSend(amountToStake, tokenAddress)
    }
  }, [approveErc20State, tokenAddress, amountToStake])
  return { approveAndStake, approveErc20State, stakeState }
}
