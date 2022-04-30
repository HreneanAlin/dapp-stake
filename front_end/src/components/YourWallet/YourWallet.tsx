import { Box, makeStyles, Tab } from "@material-ui/core"
import React, { useState } from "react"
import { Token } from "../Main"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { WalletBalance } from "./WalletBalance"
import { StakeForm } from "./StakeForm"
import { Unstake } from "../Unstake/Unstake"
interface YourWalletProps {
  supportedTokens: Token[]
}
const useStyles = makeStyles(theme => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px",
  },
  header: {
    color: "white",
  },
}))
export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
  const classes = useStyles()
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0)
  const handleChange = (event: React.ChangeEvent<{}>, value: string) => {
    setSelectedTokenIndex(Number(value))
  }
  return (
    <Box>
      <h1 className={classes.header}>Your wallet</h1>
      <Box className={classes.box}>
        <TabContext value={String(selectedTokenIndex)}>
          <TabList onChange={handleChange}>
            {supportedTokens.map((token, index) => (
              <Tab key={index} label={token.name} value={String(index)} />
            ))}
          </TabList>
          {supportedTokens.map((token, index) => (
            <TabPanel key={index} value={String(index)}>
              <div className={classes.tabContent}>
                <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                <StakeForm token={supportedTokens[selectedTokenIndex]} />
                <Unstake
                  address={supportedTokens[selectedTokenIndex].address}
                />
              </div>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Box>
  )
}
