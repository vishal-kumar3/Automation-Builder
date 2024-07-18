import { postContentToWebHook } from '@/app/(main)/(pages)/connections/_actions/discord-connections'
import { Button } from '@/components/ui/button'
import { ConnectionProviderProps } from '@/providers/connections-provider'
import { Option } from '@/store'
import { usePathname } from 'next/navigation'
import React, { useCallback } from 'react'
import { toast } from 'sonner'
import { onCreateNodeTemplate } from '../../_actions/workflow-connections'
import { onCreateNewPageInDatabase } from '@/app/(main)/(pages)/connections/_actions/notion-connections'
import { postMessageToSlack } from '@/app/(main)/(pages)/connections/_actions/slack-connections'

type props = {
  currentService: string
  nodeConnection: ConnectionProviderProps
  channels: Option[]
  setChannels?: (value: Option[]) => void
}

const ActionButton = ({
  currentService,
  nodeConnection,
  channels,
  setChannels,
}: props) => {

  const pathname = usePathname()

  const onSendDiscordMessage = useCallback(async() => {
    const response = await postContentToWebHook(
      nodeConnection.discordNode.content,
      nodeConnection.discordNode.webhookURL,
    )

    if (response.message == 'success'){
      nodeConnection.setDiscordNode((prev: any) => ({
        ...prev,
        content: ''
      }))
    }

  }, [nodeConnection.discordNode])

  const onStoreNotionContent = useCallback(async() => {
    const response = await onCreateNewPageInDatabase(
      nodeConnection.notionNode.databaseId,
      nodeConnection.notionNode.accessToken,
      nodeConnection.notionNode.content,
    )

    if(response){
      nodeConnection.setNotionNode((prev: any) => ({
        ...prev,
        content: '',
      }))
    }
  }, [nodeConnection.notionNode])

  const onStoreSlackContent = useCallback(async() => {
    const response = await postMessageToSlack(
      nodeConnection.slackNode.slackAccessToken,
      channels!,
      nodeConnection.slackNode.content,
    )

    if (response.message == 'success'){
      nodeConnection.setSlackNode((prev: any) => ({
        ...prev,
        content: ''
      }))
      setChannels!([])
    } else {
      toast.message(response.message)
    }
  }, [nodeConnection.slackNode])

  const onCreateLocalNodeTempate = useCallback(async () => {
    if (currentService === 'Discord') {
      const response = await onCreateNodeTemplate(
        nodeConnection.discordNode.content,
        currentService,
        pathname.split('/').pop()!
      )

      if (response) {
        toast.message(response)
      }
    }
    if (currentService === 'Slack') {
      const response = await onCreateNodeTemplate(
        nodeConnection.slackNode.content,
        currentService,
        pathname.split('/').pop()!,
        channels,
        nodeConnection.slackNode.slackAccessToken
      )

      if (response) {
        toast.message(response)
      }
    }

    if (currentService === 'Notion') {
      const response = await onCreateNodeTemplate(
        JSON.stringify(nodeConnection.notionNode.content),
        currentService,
        pathname.split('/').pop()!,
        [],
        nodeConnection.notionNode.accessToken,
        nodeConnection.notionNode.databaseId
      )

      if (response) {
        toast.message(response)
      }
    }
  }, [nodeConnection, channels])

  const DiscordRender = (
    <>
      <Button
        variant='outline'
        onClick={onSendDiscordMessage}
      >
        Test Message
      </Button>
      <Button
        variant='outline'
        onClick={onCreateLocalNodeTempate}
      >
        Save Template
      </Button>
    </>
  )

  const NotionRender = (
    <>
      <Button
        variant='outline'
        onClick={onStoreNotionContent}
      >
        Test Message
      </Button>
      <Button
        variant='outline'
        onClick={onCreateLocalNodeTempate}
      >
        Save Template
      </Button>
    </>
  )

  const SlackRender = (
    <>
      <Button
        variant='outline'
        onClick={onStoreSlackContent}
      >
        Test Message
      </Button>
      <Button
        variant='outline'
        onClick={onCreateLocalNodeTempate}
      >
        Save Template
      </Button>
    </>
  )

  const renderActionButton = () => {
    switch (currentService){
      case 'Discord':
        return DiscordRender
      
      case 'Slack':
        return SlackRender

      case 'Notion':
        return NotionRender

      default:
        return null
    }
  }

  return renderActionButton()
}

export default ActionButton