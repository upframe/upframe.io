import React, { useState } from 'react'
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client'
import { Input, Button } from 'components'
import Chat from './messages/Chat'

const SUB = gql`
  subscription Message($channel: ID!) {
    message(channel: $channel) {
      id
      content
      author
      time
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $channel: ID!) {
    sendMessage(content: $content, channel: $channel)
  }
`

const MESSGAGES = gql`
  query Messages($channel: ID!) {
    channel(channelId: $channel) {
      id
      messages {
        edges {
          node {
            id
            author
            content
            time
          }
        }
      }
    }
  }
`

export default function Messages({ match }) {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([])

  useQuery(MESSGAGES, {
    variables: { channel: match.params.channel },
    onCompleted({ channel }) {
      setMsgs([...channel.messages.edges.map(({ node }) => node, ...msgs)])
    },
  })

  useSubscription(SUB, {
    variables: { channel: match.params.channel },
    onSubscriptionData({ subscriptionData }) {
      setMsgs([...msgs, subscriptionData.data.message])
      setInput('')
    },
  })

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: { content: input, channel: match.params.channel },
  })

  return (
    <form
      style={{ padding: '5rem' }}
      onSubmit={e => {
        e.preventDefault()
        sendMessage()
      }}
    >
      <Chat messages={msgs} />
      <Input value={input} onChange={setInput} />
      <Button type="submit">send</Button>
    </form>
  )
}
