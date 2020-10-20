import React from 'react'
import styled from 'styled-components'

interface Props {
  value: string
  onChange(v: string): void
  rows?: number
  placeholder?: string
  error?: boolean
}

const Textbox: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  rows = 5,
  error = false,
}) => {
  return (
    <S.Textbox
      rows={rows}
      onChange={({ target }) => onChange(target.value)}
      value={value}
      placeholder={placeholder}
      data-validity={error ? 'error' : undefined}
    ></S.Textbox>
  )
}

const S = {
  Textbox: styled.textarea`
    border-radius: var(--border-radius);
    padding: 0.7rem 1rem;
    color: var(--cl-text-medium);
    font: inherit;
    font-size: 1.2rem;
    box-sizing: border-box;
    resize: none;
    background-color: #f1f3f4;
    border: none;

    &:focus {
      outline: none;
    }

    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.08);
    }

    transition: background-color 0.25s ease;

    &[data-validity~='error'] {
      border: 1px solid var(--cl-error);
    }
  `,
}
export default Object.assign(Textbox, { SC: S.Textbox })
