import React, { useState } from 'react'
import Thread from './ThreadCard'
import { useConversation } from 'conversations'

interface Props {
  conversationId: string
}

export default function ConversationPreview({ conversationId }: Props) {
  const { channels } = useConversation(conversationId)
  const [loaded, setLoaded] = useState<string[]>([])

  return (
    <>
      {channels
        .filter((v, i, ch) => i === 0 || loaded.includes(ch[i - 1]?.id))
        .map(({ id }) => (
          <Thread
            key={id}
            channelId={id}
            onLoaded={() => setLoaded([...loaded, id])}
          />
        ))}
    </>
  )
}
