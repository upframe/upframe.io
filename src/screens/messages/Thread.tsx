import React, { useState, useEffect, useRef, useReducer } from 'react'
import styled from 'styled-components'
import { useChannel } from 'conversations'
import MsgQueue from './MsgQueue'
import Input from './MsgInput'
import { Spinner } from 'components'

interface Props {
  id: string
}

export default function Thread({ id }: Props) {
  const [cursor] = useState()
  const [fetchBlock, setFetchBlock] = useState(false)

  const [last, load] = useReducer(
    (state, { type, value }) =>
      !fetchBlock && type === 'more' ? state + value : state,
    20
  )

  const { messages, sendMessage, fetching, channel } = useChannel(id, {
    last,
    before: cursor,
  })
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    setFetchBlock(fetching)
  }, [fetching])

  useEffect(() => {
    if (!ref.current || !('MutationObserver' in window) || !channel) return
    const container = ref.current.parentElement

    function handleChange() {
      const node = ref.current.querySelector('article')
      if (!node || !container) return

      if (
        !node ||
        node.getBoundingClientRect().y <
          container.getBoundingClientRect().y -
            container.getBoundingClientRect().height / 5
      )
        return

      load({ type: 'more', value: 20 })
    }

    const observer = new MutationObserver(handleChange)
    observer.observe(ref.current, { childList: true })
    container?.addEventListener('scroll', handleChange)

    return () => {
      observer.disconnect()
      container?.removeEventListener('scroll', handleChange)
    }
  }, [ref, channel])

  return (
    <S.Thread ref={ref}>
      {fetching && (
        <S.Loading>
          <Spinner />
        </S.Loading>
      )}
      <MsgQueue messages={messages} />
      <Input
        placeholder="Reply"
        onSubmit={v => {
          if (sendMessage) sendMessage(v)
        }}
      />
    </S.Thread>
  )
}

const S = {
  Thread: styled.div`
    width: 100%;
    max-width: 70ch;
    padding-top: 2rem;
  `,

  Loading: styled.div`
    display: flex;
    justify-content: space-around;

    & > svg {
      width: 2.5rem;
    }
  `,
}
