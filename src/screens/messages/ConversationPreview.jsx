import React from 'react'
import { gql, useQuery } from 'gql'
import Thread from './ThreadCard'

const CONVERSATION = gql`
  query ConversationPreview($conversationId: ID!) {
    conversation(conversationId: $conversationId) {
      channels {
        id
        messages {
          edges {
            node {
              id
              content
              author
              time
            }
          }
        }
      }
    }
  }
`

export default function ConversationPreview({ id }) {
  const { data: { conversation: { channels = [] } = {} } = {} } = useQuery(
    CONVERSATION,
    {
      variables: { conversationId: id },
    }
  )

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
