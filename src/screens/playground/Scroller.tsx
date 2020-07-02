import React from 'react'
import styled from 'styled-components'
import { VirtualScroller } from 'components'

function Item({ v }) {
  console.log('render', v)
  return (
    <S.Item>
      <span>{v}</span>
    </S.Item>
  )
}

export default function Page() {
  return (
    <div>
      <VirtualScroller
        itemHeight="5rem"
        Child={Item}
        props={i => ({ v: i + 1 })}
        numChildren={1e5}
      />
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
