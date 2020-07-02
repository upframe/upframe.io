import React from 'react'
import styled from 'styled-components'
import { VirtualScroller } from 'components'

function Item({ v, ...rest }) {
  console.log('render', v)
  return (
    <S.Item {...rest}>
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
        props={i => ({ v: i })}
        min={0}
        max={10000}
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
