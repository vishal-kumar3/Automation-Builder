'use client'
import { Book, Headphones, Search } from 'lucide-react'
import React, { useEffect } from 'react'
import { Input } from '../ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'
import { useBilling } from '@/providers/billing-provider'
import { onPaymentDetails } from '@/app/(main)/(pages)/billing/_actions/payment-connections'
import { space } from 'postcss/lib/list'

type props = {}

const InfoBar = (props: props) => {
  const { credit, tier,setCredit, setTier } = useBilling()

  const onGetPayment = async () => {
    const response = await onPaymentDetails()
    if(response){
      setCredit(response.credits!)
      setTier(response.tier!)
    }
  }
  useEffect(() => {
    onGetPayment()
  }, [])

  return (
    <div className='flex flex-roq justify-end gap-6 items-center p-4 w-full dark:bg-black'>
      <span className='flex items-center gap-2 font-bold'>
        <p className='text-sm font-light text-gray-300'>Credits</p>
        {
          tier == 'Unlimited' ? (
            <span>Unlimited</span>
          ) : (
            <span>
              {credit}/{tier == 'Free' ? '10' : tier == 'Pro' &&'100'}
            </span>
          )
        }
      </span>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Headphones />
          </TooltipTrigger>
          <TooltipContent>
            <p>Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Book />
          </TooltipTrigger>
          <TooltipContent>
            <p>Guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UserButton />
    </div>
  )
}

export default InfoBar