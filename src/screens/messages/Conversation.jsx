import React from 'react'
import styled from 'styled-components'
import { gql, useQuery, useMutation } from 'gql'
import Preview from './ConversationPreview'
import { ReverseScroller } from 'components'
import StartThread from './StartThread'
import { useHistory } from 'react-router-dom'
import { path } from 'utils/url'

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
  mutation CreateConversation($participants: [ID!]!, $msg: String) {
    createConversation(participants: $participants, msg: $msg) {
      id
      conversations {
        id
        participants {
          id
          name
          profilePictures {
            size
            type
            url
          }
        }
        channels {
          id
          messages {
            edges {
              node {
                id
                content
                author
                time
              }
            }
          }
        }
      }
    }
  }
`

export default function Conversation({ participants, id }) {
  const history = useHistory()

  const [createRoom] = useMutation(CREATE_ROOM, {
    onCompleted({ createConversation: { conversations } }, ...rest) {
      const conversation = conversations.find(
        c =>
          c.participants.length === participants.length &&
          c.participants.every(({ id }) => participants.includes(id))
      )
      history.push(`${path(1)}/${conversation.id}`)
    },
  })

  return (
    <S.Room>
      {participants?.length && (
        <ParticipantsPreview participants={participants} />
      )}
      <ReverseScroller>
        {id && <Preview id={id} />}
        <StartThread
          {...(!id && {
            onSend: msg => createRoom({ variables: { participants, msg } }),
          })}
          cardView={!id}
          conversationId={id}
        />
      </ReverseScroller>
    </S.Room>
  )
}

function ParticipantsPreview({ participants }) {
  const { data: { users = [] } = {} } = useQuery(PARTICIPANTS, {
    variables: { ids: participants },
  })

  return (
    <S.Participants>{users.map(({ name }) => name).join(', ')}</S.Participants>
  )
}

const S = {
  Room: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    ${ReverseScroller.Scroller} {
      flex-grow: 1;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 3rem 1rem;
      align-items: center;
    }
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
}
