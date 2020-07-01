import React from 'react'
import styled from 'styled-components'
import { Redirect, useHistory } from 'react-router-dom'
import Preview from './ConversationPreview'
import { ReverseScroller, Spinner } from 'components'
import StartThread from './StartThread'
import { path } from 'utils/url'
import Participants from './Participants'
import { notify } from 'notification'
import { Conversation, useConversation } from 'conversations'

type ExistProps = { id: string }
type NewProps = { participants: string[] }

export default function ConSwitch(props: ExistProps | NewProps) {
  return (
    <S.Room>
      {'id' in props ? (
        <Existing id={props.id} />
      ) : (
        <New participants={props.participants} />
      )}
    </S.Room>
  )
}

function Existing({ id }: ExistProps) {
  const { conversation } = useConversation(id)

  if (conversation === undefined) return <Spinner />
  if (conversation === null) {
    notify("conversation doesn't exist")
    return <Redirect to={path(1)} />
  }
  return (
    <>
      <Participants ids={conversation.participants} />
      <ReverseScroller>
        {id && <Preview conversationId={id} />}
        <StartThread cardView={false} conversationId={id} />
      </ReverseScroller>
    </>
  )
}

function New({ participants }: NewProps) {
  const history = useHistory()

  function createRoom(msg: string) {
    Conversation.create(participants, msg).then(({ id }) => {
      history.push(`${path(1)}/${id}`)
    })
  }

  return (
    <>
      <Participants ids={participants} />
      <ReverseScroller>
        <StartThread onSend={msg => createRoom(msg)} cardView={true} />
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
