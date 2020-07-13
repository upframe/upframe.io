import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Title, Icon } from 'components'
import Thread from './ThreadCard'
import Input from './MsgInput'
import { useConversation } from 'conversations/hooks'

type Props = {
  conversationId?: string
  onSend?(msg: any): void
  cardView?: boolean
}

export default function StartThreadWrap(
  props: Require<Props, 'conversationId'> | Require<Props, 'onSend'>
) {
  return props.onSend ? (
    <StartThread {...(props as Require<Props, 'onSend'>)} />
  ) : (
    <Existing {...(props as Require<Props, 'conversationId'>)} />
  )
}

function Existing(props: Require<Props, 'conversationId'>) {
  const { conversation } = useConversation(props.conversationId)

  function send(msg: string) {
    conversation?.createChannel(msg)
  }

  return <StartThread {...props} onSend={send} />
}

function StartThread({ onSend, cardView = false }: Require<Props, 'onSend'>) {
  const [card, setCard] = useState(cardView)

  return (
    <S.Start data-type={card ? 'card' : 'button'}>
      {card ? (
        <Thread.Card>
          <S.TitleRow>
            <Title size={2}>Start a new topic</Title>
            <Icon
              icon="close"
              onClick={() => {
                setCard(false)
              }}
            />
          </S.TitleRow>
          <Input
            placeholder="Message"
            onSubmit={v => {
              setCard(false)
              onSend(v)
            }}
          />
        </Thread.Card>
      ) : (
        <Button onClick={() => setCard(true)}>Start a new Topic</Button>
      )}
    </S.Start>
  )
}

const S = {
  Start: styled.div`
    margin-top: 2rem;

    &[data-type='card'] {
      display: contents;
    }
  `,

  TitleRow: styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    * {
      margin: 0;
    }
  `,
}
