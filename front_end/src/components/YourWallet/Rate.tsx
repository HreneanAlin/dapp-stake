import React from "react"
import { useRateToken } from "../../hooks/useRateToken"
import { Token } from "../Main"

interface RateProps {
  token: Token
}

export const Rate = ({ token: { name, address } }: RateProps) => {
  const { rate, error } = useRateToken(address)
  return (
    <div>
      <p>
        1 {name} = {rate} USD
      </p>
    </div>
  )
}
