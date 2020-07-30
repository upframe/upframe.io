import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useReducer,
} from 'react'
import styled from 'styled-components'
import { useChannel } from 'conversations'
import Input from './MsgInput'
import { Spinner, VirtualScroller } from 'components'
import Message from './Message'
import { mobile } from 'styles/responsive'

interface Props {
  id: string
}

function useMessages(channelId: string) {
  const [anchorIndex, setAnchorIndex] = useState(0)
  const [anchorId, setAnchorId] = useState<string>()
  const [last, setLast] = useState(30)
  const { messages, sendMessage, channel, fetching } = useChannel(channelId, {
    last,
  })
  const [updated, changeUpdated] = useReducer(
    (
      state: [number, boolean][],
      {
        type,
        index,
        indexes = [],
        noRender = true,
      }: {
        type: 'add' | 'remove'
        index?: number
        indexes?: number[]
        noRender?: boolean
      }
    ) => {
      indexes = [...indexes, ...(typeof index === 'number' ? [index] : [])]
      return type === 'add'
        ? [
            ...state,
            ...(indexes.map(i => [i, noRender]) as [number, boolean][]),
          ]
        : state.filter(([i]) => !indexes.includes(i))
    },
    []
  )
  const [sizes, addSize] = useReducer(
    (state: { [id: string]: number }, [id, size]: [string, number]) => ({
      ...state,
      [id]: size,
    }),
    {}
  )

  const [focus, setFocus] = useState<string>()

  const anchorRef = useRef(anchorIndex)
  anchorRef.current = anchorIndex
  const msgRef = useRef(messages)
  msgRef.current = messages
  const fetchingRef = useRef(fetching)
  fetchingRef.current = fetching
  const lastRef = useRef(last)
  lastRef.current = last
  const focusRef = useRef(focus)
  focusRef.current = focus
  const sizesRef = useRef(sizes)
  sizesRef.current = sizes

  useEffect(() => {
    if (anchorId || !messages.length) return
    setAnchorId(messages[0].id)
  }, [messages, anchorId])

  useEffect(() => {
    const i = messages.findIndex(({ id }) => id === anchorId)
    if (i === anchorIndex || i < 0) return
    setAnchorIndex(i)
    changeUpdated({ type: 'add', indexes: [-anchorIndex - 1, -anchorIndex] })
  }, [messages, anchorId, anchorIndex, updated])

  useEffect(
    () =>
      channel?.on('message', msg => {
        if (!messages.find(({ id }) => id === msg.id)) {
          if (
            msg.previous &&
            messages.indexOf(msg.previous) === messages.length - 1
          ) {
            if (messages.length >= lastRef.current) {
              setAnchorIndex(anchorRef.current - 1)
            }
          }
        }
      }),
    [channel, messages, anchorRef, lastRef]
  )

  const isStacked = useCallback(
    (i: number) =>
      i > 0 &&
      i < msgRef.current.length &&
      msgRef.current[i - 1]?.author === msgRef.current[i].author &&
      msgRef.current[i].date.getTime() - msgRef.current[i - 1]?.date.getTime() <
        1000 * 60 * 5,

    [msgRef]
  )

  const size = useCallback(
    (i: number) => {
      i += anchorRef.current
      return (
        sizesRef.current[msgRef.current[i]?.id] ??
        (i < 0 || !isStacked(i) ? 56 : 24)
      )
    },
    [isStacked, anchorRef]
  )

  const loadMore = useCallback(() => {
    setLast(lastRef.current + 30)
  }, [lastRef])

  const reportSize = useCallback((size: number, id: string) => {
    const index = msgRef.current.findIndex(msg => msg.id === id)
    addSize([id, size])
    if (!index || sizesRef.current[id] > size) return
    if (sizesRef.current[id] === size) return
    changeUpdated({ type: 'add', index: index - anchorRef.current })
  }, [])

  const props = useCallback(
    (i: number) => {
      i += anchorRef.current
      if (i < 0) {
        return {
          load: true,
          loadMore,
        }
      }

      return {
        ...msgRef.current[i],
        stacked: isStacked(i),
        focused: focus && msgRef.current[i].id === focus,
        onLockFocus(v: boolean) {
          setFocus(v ? msgRef.current[i].id : undefined)
          changeUpdated({
            type: 'add',
            indexes: msgRef.current.map((_, i) => i - anchorRef.current),
            noRender: false,
          })
        },
        i: i - anchorRef.current,
        reportSize,
      }
    },
    [isStacked, msgRef, anchorRef, loadMore, reportSize, focus]
  )

  return {
    messages,
    sendMessage,
    props,
    size,
    minIndex: -anchorIndex - (channel?.hasFirst ? 0 : 1),
    maxIndex: messages.length - 1 - anchorIndex,
    updated,
    changeUpdated,
    blockScroll: typeof focus === 'string',
  }
}

export default function Thread({ id }: Props) {
  const {
    messages,
    sendMessage,
    props,
    size,
    minIndex,
    maxIndex,
    updated,
    changeUpdated,
    blockScroll,
  } = useMessages(id)

  return (
    <S.Wrap>
      <S.Thread>
        <S.Messages>
          {messages?.length > 0 && (
            <VirtualScroller
              size={size}
              Child={Item}
              props={props}
              min={minIndex}
              max={maxIndex}
              buffer={5}
              anchorBottom
              update={updated}
              onUpdate={(...indexes) => {
                changeUpdated({ type: 'remove', indexes })
              }}
              blockScroll={blockScroll}
            />
          )}
        </S.Messages>
        <S.InputBar>
          <Input
            placeholder="Reply"
            onSubmit={v => {
              if (sendMessage) sendMessage(v)
            }}
          />
        </S.InputBar>
      </S.Thread>
    </S.Wrap>
  )
}

function Item(props) {
  return props.load ? (
    <LoadMore {...props} />
  ) : (
    <Message {...props} reportSize={props.reportSize} />
  )
}

function LoadMore({ loadMore }) {
  useEffect(() => {
    const tId = setTimeout(loadMore, 100)
    return () => clearTimeout(tId)
  }, [loadMore])

  return (
    <S.Load>
      <Spinner />
    </S.Load>
  )
}

const S = {
  Wrap: styled.div`
    width: 100%;
    box-sizing: border-box;
    padding-left: 15%;
    padding-left: min(15%, calc((100vw - 20rem - var(--chat-max-width)) / 2));
    flex-grow: 1;
    overflow-y: hidden;

    @media (max-width: 1007.67px) {
      padding: 0;
    }

    @media ${mobile} {
      padding: 0 1rem;
    }
  `,

  Thread: styled.div`
    width: 100%;
    max-width: var(--chat-max-width);
    display: flex;
    flex-direction: column;
    justify-items: space-between;
    height: 100%;
  `,

  Loading: styled.div`
    display: flex;
    justify-content: space-around;

    & > svg {
      width: 2.5rem;
    }
  `,

  Messages: styled.div`
    flex-grow: 1;
    overflow-y: scroll;
    box-sizing: border-box;
  `,

  InputBar: styled.div`
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    padding-top: 1rem;
    padding-bottom: 2rem;

    textarea {
      margin: 0;
    }
  `,

  Msg: styled.span`
    height: 200px;
    line-height: 200px;
  `,

  Load: styled.div`
    width: 64px;
    height: 64px;
    display: block;
    position: relative;
    flex-shrink: 0;
    margin: auto;

    svg {
      --size: 2.5rem;

      width: var(--size);
      height: var(--size);
      position: absolute;
      left: calc(50% - var(--size) / 2);
      top: calc(50% - var(--size) / 2);
    }
  `,
}
