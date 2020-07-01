import React from 'react'
import styled from 'styled-components'

interface Props {
  value: string
  onChange: Function
  onSubmit: Function
  placeholder?: string
}

export default function MsgInput({
  value,
  onChange,
  onSubmit = () => {},
  placeholder,
}: Props) {
  const handleKey = e => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        onSubmit(value)
        break
      default:
    }
  }

  return (
    <S.Input
      onKeyDown={handleKey}
      placeholder={placeholder}
      value={value}
      onChange={({ target }) => onChange(target.value)}
    />
  )
}

const S = {
  Input: styled.textarea`
    width: 100%;
    resize: none;
    display: block;
    box-sizing: border-box;
  `,
}
