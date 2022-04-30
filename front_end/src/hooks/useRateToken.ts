import { formatUnits } from "@ethersproject/units"
import { useCall, useEthers } from "@usedapp/core"
import { TokenFarmContract } from "../contracts/TokenFarmContract"

export const useRateToken = (tokenAddress: string) => {
  const { chainId } = useEthers()
  const tokenFarmContract = TokenFarmContract(chainId)
  const res = useCall({
    contract: tokenFarmContract,
    method: "getTokenValue",
    args: [tokenAddress],
  })
  const formattedPrice = res?.value[0] ? parseFloat(res.value[0]) : 0
  const formattedDecimals = res?.value[1] ? parseInt(res.value[1]) : 1

  return {
    rate: formattedPrice / 10 ** formattedDecimals,
    error: res?.error,
  }
}
