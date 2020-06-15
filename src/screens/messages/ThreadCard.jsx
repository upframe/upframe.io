import React, { useState } from 'react'
import styled from 'styled-components'
import { Title } from 'components'
import Input from './MsgInput'

export default function ThreadCard({ empty = false, onSend }) {
  const [input, setInput] = useState('')

  return (
    <S.Card>
      {empty && <Title s3>Start a new topic</Title>}
      <Input
        placeholder="Reply"
        value={input}
        onChange={setInput}
        onSubmit={onSend}
      />
    </S.Card>
  )
}

const S = {
  Card: styled.article`
    border: 1.5px solid #e5e5e5;
    width: 100%;
    max-width: 70ch;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 1rem;
    margin-top: 2rem;

    input {
      width: 100%;
    }

    *:first-child {
      margin-top: 0;
    }

    *:last-child {
      margin-bottom: 0;
    }
  `,
}
