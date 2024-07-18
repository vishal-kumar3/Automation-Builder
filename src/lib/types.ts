import { ConnectionProviderProps } from '@/providers/connections-provider'
import { EditorNode } from '@/providers/editor-provider'
import {z} from 'zod'

export const EditUserProfileSchema = z.object({
  email: z.string().email('Requires a valid email'),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
})

export type ConnectionType = 'Google Drive' | 'Discord' | 'Notion' | 'Slack'

export type Connection = {
  title: ConnectionType
  description: string
  image: string
  connectionKey: keyof ConnectionProviderProps
  accessTokenKey?: string
  alwaysTrue?: boolean
  slackSpecial?: boolean
}

export const WorkflowFormSchema = z.object({
  title: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
})

export type EditorCanvasTypes = 
  | 'Email'
  | 'Condition'
  | 'AI'
  | 'Slack'
  | 'Google Drive'
  | 'Discord'
  | 'Notion'
  | 'Custom Webhook'
  | 'Google Calendar'
  | 'Trigger'
  | 'Action'
  | 'Wait';

export type EditorCanvasCardType = {
  title: string
  description: string
  completed: boolean
  current: boolean
  metadata: any
  type: EditorCanvasTypes
}

export type EditorNodeType = {
  id: string
  type: EditorCanvasCardType['type']
  position: {
    x: number
    y: number
  }
  data: EditorCanvasCardType
}


export type EditorActions = 
 | {
    type: 'LOAD_DATA'
    payload: {
      elements: EditorNodeType[]
      edges: {
        id: string
        source: string
        target: string
      }[]
      }
    }
 | {
      type: "UPDATE_NODE"
      payload: {
        element: EditorNode[]
      }
    }
  | {
      type: "REDO"
    }
  | {
      type: "UNDO"
    }
  | {
      type: "SELECTED_ELEMENT"
      payload: {
        element: EditorNode
      }
    }

export const nodeMapper: Record<string, string> = {
  Notion: 'notionNode',
  Slack: 'slackNode',
  Discord: 'discordNode',
  'Google Drive': 'googleNode',
}