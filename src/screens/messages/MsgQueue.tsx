import React, { useState, useEffect } from 'react'
import Message from './Message'
import MsgType from 'conversations/message'

interface Props {
  messages: MsgType[]
}

export default function MsgQueue({ messages = [] }: Props) {
  const [msgs, setMsgs] = useState<any[]>([])

  useEffect(() => {
    setMsgs(
      messages.map((v, i, msgs) =>
        msgs[i - 1]?.author === v.author &&
        v.date.getTime() - msgs[i - 1]?.date.getTime() < 1000 * 60 * 5
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
