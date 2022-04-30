import { formatUnits } from "@ethersproject/units"
import React from "react"
import { useUserTotalValueStaked } from "../../hooks/useUserTotalValueStaked"

export const Stakes = () => {
  const res = useUserTotalValueStaked()
  const formattedTotalValue = res?.value[0]
    ? parseFloat(formatUnits(res.value[0]))
    : 0
  return (
    <div className='bg-slate-200 py-3 rounded-xl px-2 mb-2'>
      <p>
        You have staked:{" "}
        <span className='font-semibold text-lg'>
          {formattedTotalValue} tokens
        </span>
      </p>
    </div>
  )
}
