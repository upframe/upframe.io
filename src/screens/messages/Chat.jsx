import React from 'react'
import styled from 'styled-components'
import Message from './Message'

export default function Chat({ messages = [] }) {
  const msgs = messages
    .map(msg => ({ ...msg, time: new Date(msg.time) }))
    .map((v, i, msgs) =>
      msgs[i - 1]?.author === v.author &&
      v.time.getTime() - msgs[i - 1]?.time.getTime() < 1000 * 60 * 5
        ? { ...v, stacked: true }
        : v
    )
    .reverse()

  return (
    <S.Chat>
      {msgs.map(msg => (
        <Message key={msg.id} {...msg} />
      ))}
    </S.Chat>
  )
}

const S = {
  Chat: styled.div`
    overflow: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column-reverse;
  `,
}
