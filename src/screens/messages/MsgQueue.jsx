import React, { useState, useEffect } from 'react'
import Message from './Message'

export default function MsgQueue({ messages = [] }) {
  const [msgs, setMsgs] = useState([])

  useEffect(() => {
    setMsgs(
      messages
        .map(msg => ({ ...msg, time: new Date(msg.time) }))
        .map((v, i, msgs) =>
          msgs[i - 1]?.author === v.author &&
          v.time.getTime() - msgs[i - 1]?.time.getTime() < 1000 * 60 * 5
            ? { ...v, stacked: true }
            : v
        )
    )
  }, [messages])

  return (
    <>
      {msgs.map(msg => (
        <Message key={msg.id} {...msg} />
      ))}
    </>
  )
}
