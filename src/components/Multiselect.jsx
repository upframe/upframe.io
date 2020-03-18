import React, { useState } from 'react'
import styled from 'styled-components'
import { Input, Chip } from '.'

export default function MultiSelect({ selection, onChange }) {
  const [input, setInput] = useState('')

  return (
    <S.Select
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onChange(Array.from(new Set([...selection, input.toLowerCase()])))
          setInput('')
        }
      }}
    >
      <Input onChange={setInput} value={input} />
      {selection
        .map(v => (
          <Chip
            key={v}
            onClick={() => onChange(selection.filter(s => s !== v))}
          >
            {v}
          </Chip>
        ))
        .reverse()}
    </S.Select>
  )
}

const S = {
  Select: styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding-left: 1rem;
    border-radius: 0.3rem;
    background-color: #f1f3f4;
    overflow-x: auto;

    input {
      flex-grow: 1;
      padding-left: 0;
    }

    & > div {
      margin-right: 0.5rem;
    }
  `,
}
