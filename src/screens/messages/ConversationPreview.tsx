import React from 'react'
import Thread from './ThreadCard'
import { useConversation } from 'conversations'

interface Props {
  conversationId: string
}

export default function ConversationPreview({ conversationId }: Props) {
  const { conversation } = useConversation(conversationId)

  console.log('render')

  return (
    <>
      {conversation?.channels?.map(({ id }) => (
        <Thread key={id} channelId={id} />
      ))}
    </>
  )
}
