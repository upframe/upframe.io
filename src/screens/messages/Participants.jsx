import React from 'react'
import styled from 'styled-components'
import { gql, useQuery } from 'gql'

const PARTICIPANTS = gql`
  query ChatParticipants($ids: [ID!]!) {
    users(ids: $ids) {
      id
      name
      displayName
      handle
    }
  }
`

export default function Participants({ ids = [] }) {
  const { data: { users = [] } = {} } = useQuery(PARTICIPANTS, {
    variables: { ids },
  })

  return (
    <S.Participants>
      {users.map(({ displayName }) => displayName).join(', ')}
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
