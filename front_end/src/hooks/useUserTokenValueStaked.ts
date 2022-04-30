import { useEthers, useCall } from "@usedapp/core"
import { TokenFarmContract } from "../contracts/TokenFarmContract"
import { formatUnits } from "@ethersproject/units"

export const useUserTokenValueStaked = (tokenAddress: string) => {
  const { account, chainId } = useEthers()
  const tokenFarmContract = TokenFarmContract(chainId)
  const res = useCall({
    contract: tokenFarmContract,
    method: "getUserSingleTokenValue",
    args: [account, tokenAddress],
  })
  const formattedValue = res?.value[0]
    ? parseFloat(formatUnits(res.value[0]))
    : 0

  return {
    balance: formattedValue,
    error: res?.error,
  }
}
