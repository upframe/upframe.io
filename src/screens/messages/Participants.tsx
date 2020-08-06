import React from 'react'
import styled from 'styled-components'
import Participant from './Participant'
import { useParticipants } from 'conversations/hooks'

export default function Participants({ ids = [] }: { ids?: string[] }) {
  const users = useParticipants(ids)

  return (
    <S.Participants>
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
}
