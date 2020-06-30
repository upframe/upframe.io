import React from 'react'
import styled from 'styled-components'
import { Redirect, useHistory } from 'react-router-dom'
import { gql, useQuery, useMutation } from 'gql'
import Preview from './ConversationPreview'
import { ReverseScroller, Spinner } from 'components'
import StartThread from './StartThread'
import { path } from 'utils/url'
import Participants from './Participants'
import { notify } from 'notification'

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

const CONVERSATION = gql`
  query Conversation($conversationId: ID!) {
    conversation(conversationId: $conversationId) {
      id
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
      participants {
        id
      }
    }
  }
`

export default function Conversation({ participants, id }) {
  return (
    <S.Room>
      {id ? <Existing id={id} /> : <New participants={participants} />}
    </S.Room>
  )
}

function Existing({ id }) {
  const { data: { conversation } = {}, loading } = useQuery(CONVERSATION, {
    variables: { conversationId: id },
  })
  if (loading) return <Spinner />
  if (conversation === null) {
    notify("conversation doesn't exist")
    return <Redirect to={path(1)} />
  }
  return (
    <>
      <Participants ids={conversation.participants?.map(({ id }) => id)} />
      <ReverseScroller>
        {id && <Preview channels={conversation.channels} />}
        <StartThread cardView={false} conversationId={id} />
      </ReverseScroller>
    </>
  )
}

function New({ participants }) {
  const history = useHistory()

  const [createRoom] = useMutation(CREATE_ROOM, {
    onCompleted({ createConversation: { conversations } }) {
      const conversation = conversations.find(
        c =>
          c.participants.length === participants.length &&
          c.participants.every(({ id }) => participants.includes(id))
      )
      history.push(`${path(1)}/${conversation.id}`)
    },
  })

  return (
    <>
      <Participants ids={participants} />
      <ReverseScroller>
        <StartThread
          onSend={msg => createRoom({ variables: { participants, msg } })}
          cardView={true}
        />
      </ReverseScroller>
    </>
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
}
