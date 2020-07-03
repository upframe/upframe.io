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
import Thread from './Thread'

type ExistProps = { id: string; channel?: string }
type NewProps = { participants: string[] }

export default function ConSwitch(props: ExistProps | NewProps) {
  return (
    <S.Room>
      {'id' in props ? (
        <Existing id={props.id} channel={props.channel} />
      ) : (
        <New participants={props.participants} />
      )}
    </S.Room>
  )
}

function Existing({ id, channel }: ExistProps) {
  const { conversation } = useConversation(id)

  if (conversation === undefined) return <Spinner />
  if (conversation === null) {
    notify("conversation doesn't exist")
    return <Redirect to={path(1)} />
  }
  return (
    <>
      <Participants ids={conversation.participants} />
      {!channel ? (
        <ReverseScroller>
          {id && <Preview conversationId={id} />}
          <StartThread cardView={false} conversationId={id} />
        </ReverseScroller>
      ) : (
        <ReverseScroller>
          <Thread id={channel} />
        </ReverseScroller>
      )}
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
