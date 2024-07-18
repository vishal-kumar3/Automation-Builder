"use client"
import { usePathname } from 'next/navigation'
import React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'
import { sideBarOptions } from '@/lib/const'
import clsx from 'clsx'
import { Separator } from '@radix-ui/react-separator'
import { Database, GitBranch, LucideMousePointerClick, TriangleRight } from 'lucide-react'
import { ModeToggle } from '../global/modeToggel'


type props = {}

const Sidebar = (props: props) => {
  const pathName = usePathname()
  return (
    <nav className='dark:bg-black h-screen overflow-scroll overflow-x-hidden justify-between flex items-center flex-col gap-10 py-6 px-2'>
      <div className='flex items-center justify-center flex-col gap-8'>
        <Link
          className='flex font-bold flex-row'
          href="/"
        >
          Vishal
        </Link>
        <TooltipProvider>
          {
            sideBarOptions.map((option, index) => {
              return <Tooltip key={option.name}>
                <TooltipTrigger>
                  <Link 
                    href={option.href}
                    className={clsx(
                      'group h-8 w-8 flex items-center justify-center scale-[1.5] rounded-lg p-[3px] cursor-pointer',
                      {
                        'dark:bg-[#2F006B] bg-[#EEE0FF]' : pathName === option.href,
                      }
                    )}
                  >
                    <option.Component selected={pathName === option.href} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side='right'
                  className='bg-black/30 text-white/50 backdrop-blur-xl'
                >
                  <p>{option.name}</p>
                </TooltipContent>
              </Tooltip>
            })
          }
        </TooltipProvider>
      <Separator />
      <div className='flex items-center flex-col gap-9 dark:bg-[#353346]/30 py-4 px-2 rounded-full h-56 overflow-scroll border-[1px]'>
        <div className='relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]'>
          <LucideMousePointerClick
            className='dark:text-white'
            size={18}
          />
          <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
        </div>
        <div className='relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]'>
          <GitBranch
            className='dark:text-white'
            size={18}
          />
          <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
        </div>
        <div className='relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]'>
          <Database
            className='dark:text-white'
            size={18}
          />
          <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
        </div>
        <div className='relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]'>
          <TriangleRight
            className='dark:text-white'
            size={18}
          />
        </div>
      </div>
      <ModeToggle />
      </div>

    </nav>
  )
}

export default Sidebar