import React from 'react'

type props = { children: React.ReactNode}

const layout = ({children}: props) => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
      {children}
    </div>
  )
}

export default layout