import React, { useState } from 'react'
import styled from 'styled-components'
import EmptyRoom from './messages/EmtpyRoom'
import ConversationList from './messages/ConversationList'
import { useHistory } from 'react-router-dom'
import Conversation from './messages/Conversation'
import { path } from 'utils/url'
import * as responsive from 'styles/responsive'
import { useMatchMedia } from 'utils/hooks'

export default function Conversations({ match }) {
  const select = match.params.conversationId === 'new'
  const history = useHistory()
  const [selected, setSelected] = useState([])

  const mobile = useMatchMedia(responsive.mobile)

  function toggleSelect(v = !select) {
    if (v !== select) history.push(path(1) + (select ? '' : '/new'))
  }

  return (
    <S.Conversations>
      {(!mobile || select || !match.params.conversationId) && (
        <S.Left>
          <ConversationList
            select={select}
            onToggleSelect={toggleSelect}
            selected={selected}
            onSelection={setSelected}
          />
        </S.Left>
      )}
      {(!mobile || (!select && match.params.conversationId)) && (
        <S.Right>
          {!select && !match.params.conversationId && (
            <EmptyRoom onToggleSelect={toggleSelect} />
          )}
          {select && selected.length > 0 && (
            <Conversation participants={selected.map(({ id }) => id)} />
          )}
          {match.params.conversationId &&
            match.params.conversationId !== 'new' && (
              <Conversation
                id={match.params.conversationId}
                channel={match.params.channelId}
              />
            )}
        </S.Right>
      )}
    </S.Conversations>
  )
}

const S = {
  Conversations: styled.div`
    --chat-max-width: 70ch;

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

    @media ${responsive.mobile} {
      border: none;
      width: 100%;
    }
  `,

  Right: styled.div`
    height: 100%;
    flex-grow: 1;
  `,
}
