import React from 'react'
import styled from 'styled-components'
import { Title, Icon } from 'components'

export default function ConversationList() {
  function startNew() {}

  return (
    <S.Conversations>
      <S.Head>
        <Title s2>Conversations</Title>
        <Icon icon="add" onClick={startNew} />
      </S.Head>
    </S.Conversations>
  )
}

const S = {
  Conversations: styled.div`
    margin: 0 10%;
  `,

  Head: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & > svg {
      width: 1.8rem;
      height: 1.8rem;
      background-color: #e5e5e5;
    }
  `,
}
