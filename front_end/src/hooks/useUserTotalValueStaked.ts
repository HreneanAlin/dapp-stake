import { useCall, useEthers } from "@usedapp/core"
import { TokenFarmContract } from "../contracts/TokenFarmContract"

export const useUserTotalValueStaked = () => {
  const { account, chainId } = useEthers()
  const tokenFarmContract = TokenFarmContract(chainId)
  return useCall({
    contract: tokenFarmContract,
    method: "getUserTotalValue",
    args: [account],
  })
}
