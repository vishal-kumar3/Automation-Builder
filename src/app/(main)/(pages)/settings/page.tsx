import ProfileForm from '@/components/forms/ProfileForm'
import React from 'react'
import ProfilePicture from './_components/ProfilePicture'

import { currentUser } from '@clerk/nextjs/server'
import {prisma} from '@/lib/db'

type props = {}

const Settings = async (props: props) => {
  
  const authUser = await currentUser();
  if(!authUser) return null

  const user = await prisma.user.findUnique({
    where: {
      clerkId: authUser?.id,
    },
  })

  const removeProfileImage = async() => {
    'use server'
    const response = await prisma.user.update({
      where: {
        clerkId: authUser?.id,
      },
      data: {
        profileImage: '',
      },
    })
    return response
  }

  const uploadProfileImage = async (profileImage: string) => {
    'use server'

    if(!profileImage || profileImage === '') return console.error('No image provided')

    const response = await prisma.user.update({
      where: {
        clerkId: authUser?.id,
      },
      data: {
        profileImage,
      },
    })

    return response
  }

  const updateUserInfo = async (name : string) => {
    'use server'

    if(!name || name === '') return console.error('No name provided')

    const response = await prisma.user.update({
      where: {
        clerkId: authUser?.id,
      },
      data: {
        name,
      },
    })
    
    return response
  }
  
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg'>
        <span>Settings</span>
      </h1>
      <div className='flex flex-col gap-10 p-6'>
        <div>
          <h2 className='text-2xl font-bold'>User Profile</h2>
          <p className='text-base text-white/50'>Add or update your information</p>
        </div>
        <ProfilePicture
          onDelete={removeProfileImage}
          userImage={user?.profileImage || ''}
          onUpload={uploadProfileImage}
        ></ProfilePicture>
        <ProfileForm 
          user={user}
          onUpdate={updateUserInfo}
        />
      </div>
    </div>
  )
}

export default Settings