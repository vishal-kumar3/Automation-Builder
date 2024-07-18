'use client'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import Link from 'next/link'
import { onFlowPublish } from '../editor/_actions/workflow-connections'
import { toast } from 'sonner'

type props = {
  name:string
  description : string
  id : string
  publish : boolean | null
}

const img = [
  {
    src : '/googleDrive.png',
    alt : 'Google Drive' 
  },
  {
    src: '/notion.png',
    alt: 'Notion'
  },
  {
    src: '/discord.png',
    alt: 'Discord'
  }
]

const Workflow = ({name, description, id, publish}: props) => {

  const onPublishFlow = async(event: any) => {
    console.log(event)
    const response = await onFlowPublish(
      id,
      event.target.ariaChecked === 'false'
    )
    
    response && toast.message(response)
  }

  return (
    <Card className='flex w-full items-center justify-between'>
      <CardHeader className='flex flex-col gap-4'>
        <Link href={`/workflows/editor/${id}`}>
          <div className='flex flex-row gap-2'>
            {
              img.map(({src, alt}, index) => {
                return ( 
                <Image
                  key={index}
                  src={src}
                  alt={alt}
                  height={30}
                  width={30}
                  className='object-contain'
                />
              )})
            }
          </div>
          <div className=''>
            <CardTitle className='text-lg'>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>
      <div className='flex flex-col items-center gap-2 p-4'>
        <Label 
          htmlFor='airplane-mode'
          className='text-muted-foreground'
        >
          { publish ? 'ON' : 'OFF' }
        </Label>
        <Switch
          id='airplane-mode'
          onClick={onPublishFlow}
          defaultChecked={publish!}
        />
      </div>
    </Card>
  )
}

export default Workflow