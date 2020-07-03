import React, { useState } from 'react'
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
  const [min, setMin] = useState(-20)
  const [max, setMax] = useState(20)

  return (
    <div>
      <VirtualScroller
        itemHeight="5rem"
        Child={Item}
        props={i => ({ v: i })}
        min={min}
        max={max}
      />
      <button
        onClick={() => {
          setMax(max * 2)
        }}
      >
        max
      </button>
      <button
        onClick={() => {
          setMin(min - 20)
        }}
      >
        min
      </button>
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
