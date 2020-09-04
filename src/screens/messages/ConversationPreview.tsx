import React, { useState } from 'react'
import styled from 'styled-components'
import Thread from './ThreadCard'
import { useConversation } from 'conversations'
import { useTimeMarker } from 'utils/hooks'

interface Props {
  conversationId: string
}

export default function ConversationPreview({ conversationId }: Props) {
  const { channels } = useConversation(conversationId)
  const [loaded, setLoaded] = useState<string[]>([])

  return (
    <>
      {channels
        .filter((v, i, ch) => i === 0 || loaded.includes(ch[i - 1]?.id))
        .flatMap(({ id, startTime }) => [
          <Thread
            key={id}
            channelId={id}
            onLoaded={() => setLoaded([...loaded, id])}
          />,
          startTime ? <Timestamp time={startTime} key={`ts-${id}`} /> : null,
        ])}
    </>
  )
}

function Timestamp({ time }: { time: Date }) {
  const ts = useTimeMarker(time)
  return <S.Timestamp>{ts}</S.Timestamp>
}

const S = {
  Timestamp: styled.span`
    color: #0006;
    font-size: 0.8rem;
    display: block;
    position: relative;
    text-transform: uppercase;

    --top: 1.5rem;
    --bottom: 0.5rem;

    margin-top: var(--top);
    margin-bottom: var(--bottom);

    *[data-browser='firefox'] > & {
      margin-top: var(--bottom);
      margin-bottom: var(--top);
    }

    &:last-of-type::after {
      content: '';
      display: block;
      position: absolute;
      top: -2rem;
      left: 0;
      width: 100%;
      height: 2rem;
    }
  `,
}
