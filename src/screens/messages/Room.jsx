import React from 'react'
import styled from 'styled-components'
import { gql, useQuery, useMutation } from 'gql'
import Thread from './ThreadCard'

const PARTICIPANTS = gql`
  query ChatParticipants($ids: [ID!]!) {
    users(ids: $ids) {
      id
      name
      handle
    }
  }
`

const CREATE_ROOM = gql`
  mutation createConversation($participants: [ID!]!) {
    createMsgRoom(participants: $participants)
  }
`

export default function Room({ participants = [] }) {
  const { data: { users = [] } = {} } = useQuery(PARTICIPANTS, {
    variables: { ids: participants },
  })

  const [createRoom] = useMutation(CREATE_ROOM, { variables: { participants } })

  return (
    <S.Room>
      <S.Participants>
        {users.map(({ name }) => name).join(', ')}
      </S.Participants>
      <S.Main>
        <Thread empty onSend={createRoom} />
      </S.Main>
    </S.Room>
  )
}

const S = {
  Room: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,

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

  Main: styled.div`
    flex-grow: 1;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 3rem 1rem;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  `,
}
