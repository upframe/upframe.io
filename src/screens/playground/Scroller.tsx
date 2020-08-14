import React, { useState } from 'react'
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

const cstSize = {}

const size = (i: number): number => {
  return cstSize[i] ?? 32 + (Math.sin(Math.abs(i) % 23) + 1) * 40
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
  const [updateInput, setUpdateInput] = useState('')
  const [toUpdate, setToUpdate] = useState<number[]>([])
  const [addInput, setAddInput] = useState('')
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(14)

  function update() {
    cstSize[updateInput] = 200
    setToUpdate([...toUpdate, parseInt(updateInput)])
    setUpdateInput('')
  }

  function add(top: boolean) {
    const v = parseInt(addInput)
    if (top) setMin(min - v)
    else setMax(max + v)
    setAddInput('')
  }

  return (
    <S.Page>
      <VirtualScroller
        size={size}
        Child={Item}
        props={i => ({ v: i })}
        min={min}
        max={max}
        buffer={2}
        anchorBottom
        update={toUpdate.map(i => [i])}
        onUpdate={id => setToUpdate(toUpdate.filter(v => v !== id))}
      />
      <S.Controls>
        <input
          value={updateInput}
          onChange={({ target }) => setUpdateInput(target.value)}
          type="number"
        ></input>
        <button onClick={update}>update</button>
        <br />
        <input
          value={addInput}
          onChange={({ target }) => setAddInput(target.value)}
          type="number"
        />
        <button onClick={() => add(true)}>add top</button>
        <button onClick={() => add(false)}>add bottom</button>
      </S.Controls>
    </S.Page>
  )
}

type ItemProps = { size: number; color: string }

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

  Controls: styled.div`
    position: absolute;
    left: 1rem;
    bottom: 1rem;
  `,
}
