import React from 'react'
import Thread from './ThreadCard'
import { useConversation } from 'conversations'

interface Props {
  conversationId: string
}

export default function ConversationPreview({ conversationId }: Props) {
  const { channels } = useConversation(conversationId)

  return (
    <>
      {channels.map(({ id }) => (
        <Thread key={id} channelId={id} />
      ))}
    </>
  )
}
