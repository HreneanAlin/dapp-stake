import { Alert, Button, CircularProgress, Snackbar } from "@mui/material"
import React from "react"
import { useUnstakeToken } from "../../hooks/useUnstakeToken"

interface UnstakesProps {
  address: string
}
export const Unstake = ({ address }: UnstakesProps) => {
  const { isMining, isSuccess, unstake, resetState } = useUnstakeToken(address)
  const handleUnstake = () => {
    unstake(address)
  }
  const handleClose = () => {
    resetState()
  }

  return (
    <div>
      <Button
        size='large'
        color='success'
        onClick={handleUnstake}
        variant='contained'
      >
        {isMining ? <CircularProgress /> : "Unstake"}
      </Button>
      <Snackbar open={isSuccess} onClose={handleClose} autoHideDuration={5000}>
        <Alert severity='success'>Token Unstaked</Alert>
      </Snackbar>
    </div>
  )
}
