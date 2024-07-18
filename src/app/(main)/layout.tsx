import InfoBar from '@/components/infobar/Infobar'
import Sidebar from '@/components/sidebar'
import React from 'react'

type props = { children: React.ReactNode }

const layout = (props : props) => {
  return (
    <div className='flex overflow-hidden h-screen'>
      <Sidebar />
      <div className='w-full'>
        <InfoBar />
        {props.children}
      </div>
    </div>
  )
}

export default layout
