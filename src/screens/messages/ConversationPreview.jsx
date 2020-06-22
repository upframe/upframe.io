import React from 'react'
import Thread from './ThreadCard'

export default function ConversationPreview({ channels }) {
  return (
    <>
      {channels.map(({ id, messages }) => (
        <Thread
          key={id}
          id={id}
          messages={messages.edges.map(({ node }) => node)}
        />
      ))}
    </>
  )
}
