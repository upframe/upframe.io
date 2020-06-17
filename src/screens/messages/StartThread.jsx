import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Title, Icon } from 'components'
import Thread from './ThreadCard'
import Input from './MsgInput'

export default function StartThread({
  conversationId,
  onSend,
  cardView = false,
}) {
  const [card, setCard] = useState(cardView)
  const [input, setInput] = useState('')

  function send() {}

  return (
    <S.Start data-type={card ? 'card' : 'button'}>
      {card ? (
        <Thread.Card>
          <S.TitleRow>
            <Title s3>Start a new topic</Title>
            <Icon
              icon="close"
              onClick={() => {
                setCard(false)
                setInput('')
              }}
            />
          </S.TitleRow>
          <Input
            placeholder="Message"
            value={input}
            onChange={setInput}
            onSubmit={typeof onSend === 'function' ? onSend : send}
          />
        </Thread.Card>
      ) : (
        <Button onClick={setCard}>Start a new Topic</Button>
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
