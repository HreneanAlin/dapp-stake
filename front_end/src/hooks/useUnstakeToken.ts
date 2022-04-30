import { useContractFunction, useEthers, useNotifications } from "@usedapp/core"
import { TokenFarmContract } from "../contracts/TokenFarmContract"

export const useUnstakeToken = (tokenAddress: string) => {
  const { chainId } = useEthers()
  const tokenFarmContract = TokenFarmContract(chainId)
  const { send, state, resetState } = useContractFunction(
    tokenFarmContract,
    "unstakeToken",
    {
      transactionName: "Unstake tokens",
    }
  )

  return {
    unstake: send,
    isMining: state.status === "Mining",
    isSuccess: state.status === "Success",
    resetState,
  }
}
