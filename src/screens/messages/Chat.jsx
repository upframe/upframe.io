import React from 'react'
import styled from 'styled-components'
import Message from './Message'

export default function Chat({ messages = [] }) {
  const msgs = messages
    .map(msg => ({ ...msg, time: new Date(msg.time) }))
    .sort((a, b) => a.time.getTime() - b.time.getTime())
    .map((v, i, msgs) =>
      msgs[i - 1]?.author === v.author &&
      msgs[i - 1]?.time.getTime() - v.time.getTime() < 1000 * 60 ** 2 * 10
        ? { ...v, stacked: true }
        : v
    )

  return (
    <S.Chat>
      {msgs.map(msg => (
        <Message key={msg.time.getTime() + msg.author} {...msg} />
      ))}
    </S.Chat>
  )
}

const S = {
  Chat: styled.div`
    margin: 3rem 0;
  `,
}
