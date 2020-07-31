import React from 'react'
import styled from 'styled-components'
import { gql, useQuery } from 'gql'
import Participant from './Participant'
import { person } from 'gql/fragments'
import type { ChatParticipants, ChatParticipantsVariables } from 'gql/types'

const PARTICIPANTS = gql`
  query ChatParticipants($ids: [ID!]!) {
    users(ids: $ids) {
      ...PersonBase
      timezone {
        utcOffset
        informal {
          current {
            name
          }
        }
      }
    }
  }
  ${person.base}
`

export default function Participants({ ids = [] }: { ids?: string[] }) {
  const { data: { users = [] } = {} } = useQuery<
    ChatParticipants,
    ChatParticipantsVariables
  >(PARTICIPANTS, {
    variables: { ids },
  })

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
