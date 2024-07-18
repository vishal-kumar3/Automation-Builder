import UploadCareButton from './uploadCareButton'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { revalidatePath } from 'next/cache'

type props = {
  userImage: string | null
  onDelete?: any
  onUpload?: any
}

const ProfilePicture = ({userImage, onDelete, onUpload}: props) => {

  const onRemoveProfileImage = async() => {
    'use server'
    const response = await onDelete()
    if(response){
      revalidatePath("/settings")
    }
  }

  return (
    <div className='flex flex-col'>
      <p className='text-lg text-white'>Profile Picture</p>
      <div className='h-[30vh] flex flex-col items-center justify-center'>
      
      {
        userImage ? 
          <>
            <form className='h-full flex flex-col items-center justify-center' action={onRemoveProfileImage}>
              <div className=' relative flex justify-center items-center h-full w-full'>
                <Image className='h-full w-auto' src={userImage} alt='User_Image' height={1080} width={900} objectFit='contain' />
              </div>
              <Button
                className='bg-red-600 text-white/70 hover:bg-red-700 hover:text-black'
              >
                <X /> Remove Logo
              </Button>
            </form>
          </>
          : 
          <UploadCareButton onUpload={onUpload} />
      }
      </div>
    </div>
  )
}

export default ProfilePicture