import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Input, Button, Spinner } from 'components'
import Chat from './messages/Chat'
import { useMe } from 'utils/hooks'
import styled from 'styled-components'

const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $channel: ID!) {
    sendMessage(content: $content, channel: $channel) {
      id
    }
  }
`

const MESSGAGES = gql`
  query Messages($channel: ID!, $cursor: ID) {
    channel(channelId: $channel) {
      id
      messages(last: 10, before: $cursor) {
        edges {
          node {
            id
            author
            content
            time
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`

export default function Messages({ match }) {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([])
  const { me } = useMe()
  const [cursor, setCursor] = useState()
  const ref = useRef()

  const { loading, data: { channel } = {} } = useQuery(MESSGAGES, {
    variables: { channel: match.params.channel, cursor },
    onCompleted({ channel }) {
      setMsgs([
        ...channel.messages.edges.map(({ node }) => node),
        ...msgs.filter(
          ({ id }) => !channel.messages.edges.find(({ node }) => node.id === id)
        ),
      ])
    },
  })

  // useSubscription(SUB, {
  //   variables: { channel: match.params.channel },
  //   onSubscriptionData({ subscriptionData }) {
  //     let i = msgs.findIndex(
  //       ({ local, content }) =>
  //         local && content === subscriptionData.data.message.content
  //     )
  //     if (i < 0) i = Infinity
  //     setMsgs([
  //       ...msgs.slice(0, i),
  //       subscriptionData.data.message,
  //       ...msgs.slice(i + 1),
  //     ])
  //   },
  // })

  const [sendMessage] = useMutation(SEND_MESSAGE)

  function send() {
    const content = input
    setInput('')
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
      variables: { content, channel: match.params.channel },
    })
  }

  useEffect(() => {
    if (!ref.current || !('MutationObserver' in window)) return

    const chat = ref.current.querySelector('[data-type="chat"]')
    if (!chat) return

    function handleChange() {
      if (loading || !channel?.messages?.pageInfo?.hasNextPage) return

      const node = Array.from(
        ref.current
          .querySelector('[data-type="chat"]')
          .querySelectorAll('article')
      ).slice(-1)[0]

      if (
        node.getBoundingClientRect().y < ref.current.getBoundingClientRect().y
      )
        return

      const newCursor = node.dataset.id

      if (newCursor === cursor) return

      setCursor(newCursor)
    }

    const observer = new MutationObserver(handleChange)
    observer.observe(chat, { childList: true })

    chat.addEventListener('scroll', handleChange)

    return () => {
      observer.disconnect()
      chat.removeEventListener('scroll', handleChange)
    }
  }, [ref, cursor, loading, channel])

  return (
    <S.Conversation
      onSubmit={e => {
        e.preventDefault()
        send()
      }}
      ref={ref}
    >
      {loading && (
        <S.Loading>
          <Spinner />
        </S.Loading>
      )}
      <Chat messages={msgs} />
      <S.Submit>
        <Input value={input} onChange={setInput} />
        <Button type="submit">send</Button>
      </S.Submit>
    </S.Conversation>
  )
}

const S = {
  Conversation: styled.form`
    border: 1px dotted red;
    width: 80vw;
    margin: 0 auto;
    height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  `,

  Submit: styled.div`
    flex-shrink: 0;
  `,

  Loading: styled.div`
    display: flex;
    justify-content: space-around;

    & > svg {
      width: 2.5rem;
    }
  `,
}
