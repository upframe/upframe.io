import React, { useState } from 'react'
import styled from 'styled-components'
import EmptyRoom from './messages/EmtpyRoom'
import ConversationList from './messages/ConversationList'

export default function Conversations() {
  const [select, setSelect] = useState(true)

  return (
    <S.Conversations>
      <S.Left>
        <ConversationList select={select} onToggleSelect={setSelect} />
      </S.Left>
      <S.Right>{!select && <EmptyRoom onToggleSelect={setSelect} />}</S.Right>
    </S.Conversations>
  )
}

const S = {
  Conversations: styled.div`
    display: flex;
    flex-direction: row;
    margin-top: -1rem;
    margin-bottom: -5rem;
    height: calc(100vh - 5rem);
    box-sizing: border-box;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      display: block;
      top: -1rem;
      width: 100%;
      height: 1rem;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      z-index: 1;
    }
  `,

  Left: styled.div`
    width: 20rem;
    height: 100%;
    border-right: 1.5px solid #e5e5e5;
    box-sizing: border-box;
  `,

  Right: styled.div`
    height: 100%;
    flex-grow: 1;
  `,
}
