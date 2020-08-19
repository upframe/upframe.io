import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import EmptyRoom from './messages/EmtpyRoom'
import ConversationList from './messages/ConversationList'
import { useHistory } from 'react-router-dom'
import ConvView from './messages/Conversation'
import * as responsive from 'styles/responsive'
import { useMatchMedia, useLoggedIn } from 'utils/hooks'
import Conversation from 'conversations/conversation'
import { gql, fragments } from 'gql'
import api from 'api'

const SELECTED = gql`
  query SelectedPartsInfo($ids: [ID!]!) {
    users(ids: $ids) {
      ...PersonBase
    }
  }
  ${fragments.person.base}
`

export default function Conversations({ match }) {
  const select = new URLSearchParams(window.location.search).has('parts')
  const history = useHistory()
  const [selected, setSelected] = useState(
    new URLSearchParams(window.location.search)
      .get('parts')
      ?.split('_')
      .filter(v => v !== 'new')
      .map(id => ({ id })) ?? []
  )
  useLoggedIn({ redirect: true })

  const mobile = useMatchMedia(responsive.mobile)

  function toggleSelect(v = !select) {
    if (v === select) return
    const params = new URLSearchParams(window.location.search)
    if (v) params.set('parts', 'new')
    else {
      params.delete('parts')
      setSelected([])
    }
    let qStr = params.toString()
    if (qStr) qStr = '?' + qStr
    if (v !== select) history.push(window.location.pathname + qStr)
  }

  const conversation =
    select && Conversation.getByUsers(selected.map(({ id }) => id))

  useEffect(() => {
    if (!select) {
      if (
        typeof new URLSearchParams(window.location.search).get('parts') ===
        'string'
      )
        history.replace(
          window.location.pathname +
            window.location.search
              .replace(/[?&]parts=[a-z0-9-]+/, '')
              .replace(/^&/, '?')
        )
      return
    }
    if (!selected.length) {
      const params = new URLSearchParams(window.location.search)
      params.set('parts', 'new')
      history.replace(`${window.location.pathname}?${params.toString()}`)
      return
    }
    const params = new URLSearchParams(window.location.search)
    params.set('parts', selected.map(({ id }) => id).join('_'))
    history.replace(`${window.location.pathname}?${params.toString()}`)
    const unknown = selected.filter(({ name }) => !name).map(({ id }) => id)
    if (!unknown.length) return
    api
      .query({ query: SELECTED, variables: { ids: unknown } })
      .then(({ data }) => {
        setSelected(
          selected.map(v => data.users.find(({ id }) => id === v.id) ?? v)
        )
      })
  }, [select, selected, history])

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
      {(!mobile || (!selected.length && match.params.conversationId)) && (
        <S.Right>
          {!selected.length && !match.params.conversationId && (
            <EmptyRoom onToggleSelect={toggleSelect} />
          )}
          {selected.length > 0 && (
            <ConvView
              {...(conversation
                ? { id: conversation.id }
                : { participants: selected.map(({ id }) => id) })}
            />
          )}
          {match.params.conversationId && !selected.length && (
            <ConvView
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

    @media ${responsive.mobile} {
      width: 100vw;
    }
  `,
}
