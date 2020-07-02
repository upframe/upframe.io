import React from 'react'
import styled from 'styled-components'
import { VirtualScroller } from 'components'

export default function Page() {
  return (
    <div>
      <VirtualScroller itemHeight="5rem">
        {Array(1e4)
          .fill(0)
          .map((_, i) => (
            <S.Item key={i}>
              <span>{i + 1}</span>
            </S.Item>
          ))}
      </VirtualScroller>
    </div>
  )
}

const S = {
  Item: styled.div`
    display: flex;
    width: 30rem;
    height: 5rem;
    line-height: 5rem;
    text-align: center;

    span {
      width: 100%;
    }
  `,
}
