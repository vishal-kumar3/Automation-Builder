'use client'
import React, { createContext, use, useContext, useState } from "react"

type BillingProviderProps = {
  credit: string
  tier: string
  setCredit: React.Dispatch<React.SetStateAction<string>>
  setTier: React.Dispatch<React.SetStateAction<string>>
}

const initialProps: BillingProviderProps = {
  credit: '0',
  tier: 'Free',
  setCredit: () => undefined,
  setTier: () => undefined,
}

type WithChildProps = {
  children: React.ReactNode
}

const context = createContext(initialProps)
const { Provider } = context

export const BillingProvider = ({ children }: WithChildProps) => {
  const [credit, setCredit] = useState(initialProps.credit)
  const [tier, setTier] = useState(initialProps.tier)

  const values = {
    credit,
    tier,
    setCredit,
    setTier,
  }


  return <Provider value={values}>{children}</Provider>
}

export const useBilling = () => {
  const state = useContext(context)
  return state
}