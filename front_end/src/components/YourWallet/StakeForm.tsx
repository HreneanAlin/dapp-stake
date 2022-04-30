import { formatUnits } from "@ethersproject/units"
import { Button, CircularProgress, Input, Snackbar } from "@material-ui/core"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import React, { useEffect, useState } from "react"
import { useStakeTokens } from "../../hooks/useStakeTokens"
import { Token } from "../Main"
import { utils } from "ethers"
import { Alert } from "@material-ui/lab"

interface StakeFormProps {
  token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {
  const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] =
    useState(false)
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false)
  const { address: tokenAddress, name } = token
  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0)
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(tokenAddress, account)
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0
  const { notifications } = useNotifications()
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value)
    setAmount(newAmount)
    console.log(newAmount)
  }
  const { approveAndStake, approveErc20State, stakeState } =
    useStakeTokens(tokenAddress)

  const isMining =
    approveErc20State.status === "Mining" || stakeState.status === "Mining"
  const handleStakeSubmit = () => {
    const amountaAsWei = utils.parseEther(String(amount))
    return approveAndStake(amountaAsWei.toString())
  }

  useEffect(() => {
    if (
      notifications.find(
        notification =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Approve erc20 transfer"
      )
    ) {
      setShowErc20ApprovalSuccess(true)
    }
    if (
      notifications.find(
        notification =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Stake tokens"
      )
    ) {
      setShowErc20ApprovalSuccess(false)
      setShowStakeTokenSuccess(true)
    }
  }, [notifications])
  const handleCloseSnack = () => {
    setShowErc20ApprovalSuccess(false)
    setShowStakeTokenSuccess(false)
  }
  return (
    <>
      <div className='flex flex-col gap-2'>
        <Input type='number' onChange={handleInputChange} />
        <Button
          color='primary'
          onClick={handleStakeSubmit}
          size='large'
          variant='contained'
          disabled={isMining}
        >
          {isMining ? <CircularProgress /> : "Stake"}
        </Button>
      </div>
      <Snackbar
        open={showErc20ApprovalSuccess}
        onClose={handleCloseSnack}
        autoHideDuration={5000}
      >
        <Alert severity='success'>Erc20 was approved</Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        onClose={handleCloseSnack}
        autoHideDuration={5000}
      >
        <Alert severity='success'>Token Staked</Alert>
      </Snackbar>
    </>
  )
}
