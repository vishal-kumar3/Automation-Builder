import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { onContentChange } from '@/lib/editor-utils'
import { nodeMapper } from '@/lib/types'
import { ConnectionProviderProps } from '@/providers/connections-provider'
import { EditorState } from '@/providers/editor-provider'
import { Option } from '@/store'
import { AccordionContent } from '@radix-ui/react-accordion'
import React, { useEffect } from 'react'
import GoogleFileDetails from './GoogleFileDetails'
import GoogleDriveFiles from './GoogleDriveFiles'
import ActionButton from './ActionButton'
import axios from 'axios'
import { toast } from 'sonner'

type props = {
  nodeConnection: ConnectionProviderProps
  newState: EditorState
  file: any
  setFile: (file : any) => void
  selectedSlackChannels: Option[]
  setSelectedSlackChannels: (value: Option[]) => void
}

const ContentBasedOnTitle = ({
  nodeConnection,
  newState,
  file,
  setFile,
  selectedSlackChannels,
  setSelectedSlackChannels,
}: props) => {
  
  const { selectedNode } = newState.editor
  const { title } = selectedNode.data

  useEffect(() => {
    const reqGoogle = async () => {
      const response: {data: {message: { files: any}}} = await axios.get('/api/drive')

      if(response){
        setFile(response.data.message.files[0])
      } else {
        toast.error('Error fetching Google Drive files')
      }
    }

    reqGoogle()
  }, [])

  // @ts-ignore
  const nodeConnectionType: any = nodeConnection[nodeMapper[title]]
  if(!nodeConnectionType) return <p>Not Connected</p>

  const isConnected = 
    title === 'Google Drive'
      ? !nodeConnection.isLoading
      : !nodeConnectionType[
          `${
            title === 'Slack'
              ? 'slackAccessToken'
              : title === 'Discord'
              ? 'webhookURL'
              : title === 'Notion'
              ? 'accessToken'
              : ''
          }`
        ]


  return (
    <AccordionContent>
      <Card>
        {title === 'Discord' && (
          <CardHeader>
            <CardTitle>{nodeConnectionType.webhookName}</CardTitle>
            <CardDescription>{nodeConnectionType.guildName}</CardDescription>
          </CardHeader>
        )}
        <div className="flex flex-col gap-3 px-6 py-3 pb-20">
          <p>{'Message'}</p>
          <Input 
            type="text"
            value={nodeConnectionType.content}
            onChange={(e) => onContentChange(nodeConnection, title, e)}
          />
          {title === 'Google Drive' && <GoogleDriveFiles />}
          <ActionButton
            currentService={title}
            nodeConnection={nodeConnection}
            channels={selectedSlackChannels}
            setChannels={setSelectedSlackChannels}
          />
        </div>
      </Card>
    </AccordionContent>
  )
}

export default ContentBasedOnTitle