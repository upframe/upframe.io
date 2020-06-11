import React, { useState } from 'react'
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client'
import { Input, Button } from 'components'
import Chat from './messages/Chat'
import { useMe } from 'utils/hooks'

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
  const { me } = useMe()

  useQuery(MESSGAGES, {
    variables: { channel: match.params.channel },
    onCompleted({ channel }) {
      setMsgs([...channel.messages.edges.map(({ node }) => node, ...msgs)])
    },
  })

  useSubscription(SUB, {
    variables: { channel: match.params.channel },
    onSubscriptionData({ subscriptionData }) {
      let i = msgs.findIndex(
        ({ local, content }) =>
          local && content === subscriptionData.data.message.content
      )
      if (i < 0) i = Infinity
      setMsgs([
        ...msgs.slice(0, i),
        subscriptionData.data.message,
        ...msgs.slice(i + 1),
      ])
    },
  })

  const [sendMessage] = useMutation(SEND_MESSAGE)

  function send() {
    const content = input
    setInput('')
    setMsgs([
      ...msgs,
      {
        id: Date.now(),
        content,
        author: me.id,
        time: new Date().toISOString(),
        local: true,
      },
    ])
    sendMessage({
      variables: { content, channel: match.params.channel },
    })
  }

  return (
    <form
      style={{ padding: '5rem' }}
      onSubmit={e => {
        e.preventDefault()
        send()
      }}
    >
      <Chat messages={msgs} />
      <Input value={input} onChange={setInput} />
      <Button type="submit">send</Button>
    </form>
  )
}
