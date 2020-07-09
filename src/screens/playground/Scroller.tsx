import React from 'react'
import styled from 'styled-components'
import { VirtualScroller } from 'components'

const colors = {
  0: '#f004',
  1: '#ff04',
  2: '#0f04',
  3: '#0ff4',
  4: '#00f4',
  5: '#f0f4',
}

const size = (i: number): number => {
  return 32 + (Math.sin(Math.abs(i) % 23) + 1) * 40
}

function Item({ v, ...rest }) {
  let cl = Math.abs(v) % 9
  if (cl > 5) cl = 5 - (cl - 5)

  return (
    <S.Item {...rest} color={colors[cl]} size={size(v)}>
      <span>{v}</span>
    </S.Item>
  )
}

export default function Page() {
  return (
    <S.Page>
      <VirtualScroller
        size={size}
        Child={Item}
        props={i => ({ v: i })}
        min={-5}
        max={100}
        buffer={2}
        anchorBottom
      />
    </S.Page>
  )
}

type ItemProps = { size: number; color }

const S = {
  Page: styled.div`
    margin-top: -1rem;
    margin-bottom: -5rem;
    display: flex;
    height: calc(100vh - 5rem);

    ${VirtualScroller.sc} {
      height: calc(100vh - 5rem);
      max-height: 50rem;
      width: 30rem;
      border: 1px solid black;
      margin: auto;
    }
  `,

  Item: styled.div.attrs((p: ItemProps) => ({
    style: {
      height: `${p.size}px`,
      lineHeight: `${p.size}px`,
      backgroundColor: p.color,
    },
  }))<ItemProps>`
    display: flex;
    width: 100%;
    text-align: center;

    span {
      width: 100%;
    }
  `,
}
