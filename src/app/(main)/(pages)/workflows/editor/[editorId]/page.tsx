import { ConnectionsProvider } from '@/providers/connections-provider'
import EditorProvider from '@/providers/editor-provider'
import React from 'react'
import EditorCanvas from './_components/editorCanvas'

type props = {
  editorId: string
}

const Editor = ({ editorId }: props) => {
  return (
    <div className='h-full'>
      <EditorProvider>
        <ConnectionsProvider>
          <EditorCanvas />
        </ConnectionsProvider>
      </EditorProvider>
    </div>
  )
}

export default Editor