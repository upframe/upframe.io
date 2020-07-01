import React, { useState } from 'react'
import styled from 'styled-components'
import Input from './MsgInput'
import MsgQueue from './MsgQueue'
import Message from './Message'
import { useChannel } from 'conversations'

interface Props {
  channelId: string
}

function ThreadCard({ channelId }: Props) {
  const [input, setInput] = useState('')
  const { messages, sendMessage } = useChannel(channelId, { last: 20 })

  function send() {
    if (sendMessage) sendMessage(input)
    setInput('')
  }

  return (
    <S.Card>
      <MsgQueue messages={messages} />
      <Input
        placeholder="Reply"
        value={input}
        onChange={setInput}
        onSubmit={send}
      />
    </S.Card>
  )
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

export default Object.assign(ThreadCard, S)
