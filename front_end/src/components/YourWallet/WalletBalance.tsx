import { formatUnits } from "@ethersproject/units"
import { useEthers, useTokenBalance } from "@usedapp/core"
import React from "react"
import { useUserTokenValueStaked } from "../../hooks/useUserTokenValueStaked"
import { Token } from "../Main"
import { BalanceMessage } from "./BalanceMessage"
import { Rate } from "./Rate"

interface WalletBalanceProps {
  token: Token
}

export const WalletBalance = ({
  token: { address, image, name },
}: WalletBalanceProps) => {
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedBalance = tokenBalance
    ? parseFloat(formatUnits(tokenBalance))
    : 0
  const { balance, error } = useUserTokenValueStaked(address)
  return (
    <div>
      <Rate token={{ address, image, name }} />
      <div className='flex gap-3'>
        <BalanceMessage
          amount={formattedBalance}
          label={`Your un-staked ${name} balance`}
          tokenImageSrc={image}
        />
        <BalanceMessage
          amount={balance}
          label={`Your staked ${name} balance`}
          tokenImageSrc={image}
        />
      </div>
    </div>
  )
}
