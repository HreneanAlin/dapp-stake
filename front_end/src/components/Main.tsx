import React from "react"
import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import eth from "../eth.png"
import dai from "../dai.png"
import { YourWallet } from "./YourWallet/YourWallet"
import { makeStyles } from "@material-ui/core"
import { useUserTotalValueStaked } from "../hooks/useUserTotalValueStaked"
import { formatUnits } from "@ethersproject/units"
import { Stakes } from "./Stakes/Stakes"
import { Unstake } from "./Unstake/Unstake"

export type Token = {
  image: string
  name: string
  address: string
}
const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4),
  },
}))

export const Main = () => {
  const classes = useStyles()
  const { chainId } = useEthers()

  const networkName = chainId
    ? helperConfig[String(chainId) as keyof typeof helperConfig]
    : "dev"

  const dappTokenAddress = chainId
    ? networkMapping[String(chainId) as keyof typeof networkMapping][
        "DappToken"
      ][0]
    : constants.AddressZero

  const ciobanTokenAddress = chainId
    ? brownieConfig.networks[networkName]["cioban_token"]
    : constants.AddressZero
  const fauTokenAddress = chainId
    ? brownieConfig.networks[networkName]["fau_token"]
    : constants.AddressZero
  const supportedTokens: Token[] = [
    {
      address: dappTokenAddress,
      name: "Dapp",
      image: dapp,
    },
    {
      image: eth,
      address: ciobanTokenAddress,
      name: "Cioban",
    },
    {
      image: dai,
      address: fauTokenAddress,
      name: "DAI",
    },
  ]
  return (
    <>
      <h2 className={classes.title}>Dapp Token App</h2>
      <Stakes />
      <YourWallet supportedTokens={supportedTokens} />
    </>
  )
}
