import React, { useState, useEffect } from 'react'
import Message from './Message'
import MsgType from 'conversations/message'
import Ommission from './Omission'

interface Props {
  messages: MsgType[]
  ommission?: number[]
}

export default function MsgQueue({ messages = [], ommission = [] }: Props) {
  const [msgs, setMsgs] = useState<any[]>([])
  const [focus, setFocus] = useState()

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
      {msgs.flatMap((msg, i) => [
        <Message
          key={msg.id}
          {...msg}
          onLockFocus={v => {
            setFocus(v ? msg.id : undefined)
          }}
          {...(focus && { focused: msg.id === focus })}
        />,
        ...(ommission.includes(i)
          ? [<Ommission key={`omit-${msg.id}`} />]
          : []),
      ])}
    </>
  )
}
