import React, { useState } from 'react'
import { useMutation, useSubscription, gql } from '@apollo/client'
import { Input, Button } from 'components'
import Message from './messages/Message'

const SUB = gql`
  subscription Message($channel: ID!) {
    message(channel: $channel) {
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

export default function Messages({ match }) {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([])

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
      {msgs.map(msg => (
        <Message key={msg.time} {...msg} />
      ))}
      <Input value={input} onChange={setInput} />
      <Button type="submit">send</Button>
    </form>
  )
}
