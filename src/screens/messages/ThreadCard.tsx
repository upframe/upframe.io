import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Input from './MsgInput'
import MsgQueue from './MsgQueue'
import { useChannel } from 'conversations'
import { Link } from 'react-router-dom'
import { path } from 'utils/url'

interface Props {
  channelId: string
  onLoaded(): void
}

function ThreadCard({ channelId, onLoaded }: Props) {
  const { messages, sendMessage } = useChannel(
    channelId,
    {
      last: 31,
    },
    { first: 1 }
  )
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded || !messages.length || typeof onLoaded !== 'function') return
    setLoaded(true)
    onLoaded()
  }, [messages, loaded, onLoaded])

  return (
    <S.Card>
      <S.ThreadLink to={`${path()}/${channelId}`} />
      <MsgQueue
        {...(messages.length <= 30
          ? { messages }
          : {
              messages: [messages[0], ...messages.slice(-10)],
              ommission: [0],
            })}
      />
      <Input
        placeholder="Reply"
        onSubmit={v => {
          if (sendMessage) sendMessage(v)
        }}
        channelId={channelId}
      />
    </S.Card>
  )
}

const S = {
  Card: styled.article`
    border: 1.5px solid #e5e5e5;
    width: 100%;
    max-width: var(--chat-max-width);
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 1rem;
    position: relative;
    margin-top: 2rem;

    input {
      width: 100%;
    }

    & > *:first-child {
      margin-top: 0;
    }

    & > *:last-child {
      margin-bottom: 0;
    }
  `,

  ThreadLink: styled(Link)`
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  `,
}

export default Object.assign(ThreadCard, S)
