import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useQuery } from 'gql'
import { ProfilePicture, Markdown } from 'components'
import Time from './Time'
import type { Participant, ParticipantVariables } from 'gql/types'
import Context from './MsgContext'
import { useHeight } from 'utils/hooks'
import Channel from 'conversations/channel'
import { mobile } from 'styles/responsive'
import { PARTICIPANT } from 'conversations/gql'

const picSize = '3.2rem'

interface Props {
  id: string
  content: string
  author: string
  date: Date
  stacked?: boolean
  focused?: boolean
  onLockFocus(v: boolean): void
  i?: number
  reportSize?(size: number, id: string): void
  channelId: string
  showContext?: boolean
}

function Message({
  id,
  content,
  author,
  date,
  stacked = false,
  onLockFocus,
  focused,
  i,
  reportSize,
  channelId,
  showContext = false,
}: Props) {
  const { data } = useQuery<Participant, ParticipantVariables>(PARTICIPANT, {
    variables: { id: author },
  })
  const ref = useRef() as React.MutableRefObject<HTMLElement>
  const height = useHeight(ref)
  const [unread, setUnread] = useState(Channel.get(channelId)?.isUnread(id))
  const setUnreadRef = useRef(setUnread)
  setUnreadRef.current = setUnread

  useEffect(() => {
    if (typeof height !== 'number' || !reportSize) return
    reportSize(height, id)
  }, [height, reportSize, id])

  useEffect(() => {
    if (
      !unread ||
      !channelId ||
      !id ||
      !ref.current ||
      !ref.current.parentElement
    )
      return

    let wasEnclosed = false
    let tdId: number

    const check = () => {
      if (!ref.current || !ref.current.parentElement) return

      const { top, bottom } = ref.current.getBoundingClientRect()
      const parent = ref.current.parentElement.getBoundingClientRect()
      const pTop = parent.top
      const pBottom = pTop + ref.current.parentElement.clientHeight
      const isEnclosed = top >= pTop && bottom <= pBottom

      if (wasEnclosed && isEnclosed) {
        Channel.get(channelId)?.setReadStatus({ id, read: true })
        return
      }
      wasEnclosed = isEnclosed

      tdId = setTimeout(() => check(), 1000)
    }

    tdId = setTimeout(() => check(), 500)

    return () => clearTimeout(tdId)
  }, [unread, channelId, id, ref])

  useEffect(() => {
    if (!channelId || !id) return
    const unread = Channel.get(channelId)?.isUnread(id)
    if (!unread) return
    return Channel.get(channelId).on('unread', () => {
      if (!Channel.get(channelId)?.isUnread(id)) setUnreadRef.current(false)
    })
  }, [channelId, id])

  return (
    <S.Wrap
      {...(stacked && { 'data-stacked': true })}
      {...(focused !== undefined && {
        'data-focus': focused ? 'lock' : 'block',
      })}
      data-id={id}
      {...((reportSize || unread) && { ref })}
      {...(unread && { 'data-status': 'unread' })}
    >
      {!stacked ? (
        <ProfilePicture
          imgs={data?.user?.profilePictures}
          size={picSize}
          linkTo={`/${data?.user?.handle}`}
        />
      ) : (
        <Time>{date}</Time>
      )}
      <S.Main>
        {stacked ? (
          <div />
        ) : (
          <S.Head>
            <S.Name>{data?.user?.displayName}</S.Name>
            <Time>{date}</Time>
          </S.Head>
        )}
        <Markdown text={content} />
      </S.Main>
      {showContext && <Context id={id} onToggle={onLockFocus} i={i} />}
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.article`
    display: flex;
    flex-direction: row;
    padding: 0;
    flex-shrink: 0;
    position: relative;
    margin-top: 0.5rem;
    padding-right: 1rem;
    max-width: 100%;

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      left: -0.25rem;
      top: -0.25rem;
      width: calc(100% + 0.5rem);
      height: calc(100% + 0.5rem);
      border-radius: 0.25rem;
      transition: background-color 0.2s ease;
    }

    &[data-status='unread']::before {
      background-color: #ff004b11;
    }

    picture,
    img {
      width: ${picSize};
      height: ${picSize};
      flex-shrink: 0;
      border-radius: 1000px;
      margin-top: 0.25rem;
    }

    & > ${Time.sc} {
      opacity: 0;
      width: ${picSize};
      text-align: right;
      line-height: 1.5rem;
    }

    &:not([data-focus='block']):hover,
    &[data-focus='lock'] {
      &::before {
        background-color: #eee6;
      }

      ${Time.sc} {
        opacity: initial;
      }

      ${Context.sc} {
        display: initial;
      }
    }

    @media ${mobile} {
      ${Markdown.sc} {
        font-size: 0.9rem;
      }
    }
  `,

  Main: styled.div`
    padding-left: 1rem;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-wrap: break-word;
  `,

  Head: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2rem;
  `,

  Name: styled.span`
    margin-right: 1.1rem;
    color: #000;
    font-weight: 500;
  `,
}

export default Object.assign(Message, S)
