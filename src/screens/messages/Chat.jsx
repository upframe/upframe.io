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
    <S.Chat
      {...(navigator.userAgent.toLowerCase().includes('firefox') && {
        'data-browser': 'firefox',
      })}
    >
      {msgs.map(msg => (
        <Message key={msg.id} {...msg} />
      ))}
    </S.Chat>
  )
}

const S = {
  Chat: styled.div`
    display: flex;
    flex-direction: column-reverse;
    flex-grow: 1;
    overflow-y: auto;

    /* fix for firefox reverse flex scroll bug https://bugzilla.mozilla.org/show_bug.cgi?id=1042151
    ...that still hasn't been fixed after 6 years */
    &[data-browser='firefox'] {
      flex-direction: column;
      transform: rotate(180deg);
      direction: rtl;

      ${Message.Wrap} {
        transform: rotate(180deg);
        flex-direction: row-reverse;
      }

      ${Message.Head} {
        flex-direction: row-reverse;
      }

      ${Message.Body} {
        text-align: left;
      }
    }
  `,
}
