import React from 'react'
import styled from 'styled-components'
import Participant from './Participant'
import { useParticipants } from 'conversations/hooks'
import { Icon } from 'components'
import { useHistory } from 'react-router-dom'

export default function Participants({ ids = [] }: { ids?: string[] }) {
  const history = useHistory()
  const users = useParticipants(ids)

  const goBack = () => {
    if (
      document.referrer &&
      new URL(document.referrer).host === window.location.host
    )
      return history.goBack()
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'preview') {
      params.delete('mode')
      let qStr = params.toString()
      if (qStr) qStr = '?' + qStr
      history.replace(window.location.pathname + qStr)
    } else history.replace('/conversations')
  }

  return (
    <S.Participants>
      <S.Back onClick={goBack}>
        <Icon icon="arrow_back" />
      </S.Back>
      {users.length === 1 ? (
        <Participant user={users[0]} />
      ) : (
        users.map(({ displayName }) => displayName).join(', ')
      )}
    </S.Participants>
  )
}

const S = {
  Participants: styled.div`
    width: 100%;
    height: 4rem;
    border-bottom: 1.5px solid #e5e5e5;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 1rem;
    flex-shrink: 0;
  `,

  Back: styled.div`
    margin-right: 0.75rem;
    margin-left: -0.5rem;
    height: 100%;
    display: inline-block;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  `,
}
