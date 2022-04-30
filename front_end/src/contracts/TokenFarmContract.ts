import { utils, constants } from "ethers"
import { Contract } from "@ethersproject/contracts"

import tokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"

export const TokenFarmContract = (chainId: number | undefined) => {
  const { abi } = tokenFarm
  const tokenFarmAddress = chainId
    ? networkMapping[String(chainId)]["TokenFarm"][0]
    : constants.AddressZero
  const tokenFarmInterface = new utils.Interface(abi)
  return new Contract(tokenFarmAddress, tokenFarmInterface)
}
