import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Title } from 'components'
import Input from './MsgInput'
import MsgQueue from './MsgQueue'
import Message from './Message'
import { gql, useMutation, useSubscription } from 'gql'
import { useMe } from 'utils/hooks'

export default function ThreadCard({ empty = false, onSend, id, messages }) {
  return (
    <S.Card>
      {empty ? <Empty onSend={onSend} /> : <Chat id={id} messages={messages} />}
    </S.Card>
  )
}

function Chat({ id, messages }) {
  const [input, setInput] = useState('')
  const [msgs, _send] = useChat(id, messages)

  function send() {
    _send(input)
    setInput('')
  }

  return (
    <>
      {' '}
      <MsgQueue messages={msgs} />
      <Input
        placeholder="Reply"
        value={input}
        onChange={setInput}
        onSubmit={send}
      />
    </>
  )
}

function Empty({ onSend }) {
  const [input, setInput] = useState('')

  return (
    <>
      <Title s3>Start a new topic</Title>
      <Input
        placeholder="Reply"
        value={input}
        onChange={setInput}
        onSubmit={onSend}
      />
    </>
  )
}

const MSG_SUB = gql`
  subscription MsgSubscription($channel: ID!) {
    message(channel: $channel) {
      id
      content
      author
      time
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendChatMsg($content: String!, $channel: ID!) {
    sendMessage(content: $content, channel: $channel)
  }
`

function useChat(channel, messages) {
  const [msgs, setMsgs] = useState(messages ?? [])
  const [sendMessage] = useMutation(SEND_MESSAGE)
  const { me } = useMe()

  useSubscription(MSG_SUB, {
    variables: { channel },
    onSubscriptionData({ subscriptionData }) {
      console.log(subscriptionData)
      console.log(msgs)
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

  useEffect(() => {
    setMsgs(messages ?? [])
  }, [messages])

  function send(content) {
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
      variables: { content, channel },
    })
  }

  return [msgs, send]
}

const S = {
  Card: styled.article`
    border: 1.5px solid #e5e5e5;
    width: 100%;
    max-width: 70ch;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 1rem;
    margin-top: 2rem;

    input {
      width: 100%;
    }

    *:first-child {
      margin-top: 0;
    }

    *:last-child {
      margin-bottom: 0;
    }

    /* stylelint-disable-next-line selector-type-no-unknown */
    ${Message.Wrap}:last-of-type {
      margin-bottom: 1.5rem;
    }
  `,
}
