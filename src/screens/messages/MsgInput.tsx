import React, { useState, useRef } from 'react'
import styled from 'styled-components'

interface Props {
  onSubmit(v: string): void
  placeholder?: string
}

export default function MsgInput({ onSubmit = () => {}, placeholder }: Props) {
  const [value, setValue] = useState('')
  const ref = useRef() as React.MutableRefObject<HTMLTextAreaElement>
  const [lines, setLines] = useState(1)

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (e.shiftKey) {
          setLines(lines + 1)
          return setValue(value + '\n')
        }
        if (value) onSubmit(value)
        break
      default:
    }
  }

  function handleChange({ target }: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(target.value)

    const clone = target.previousElementSibling as HTMLTextAreaElement
    if (!clone) return
    if (clone.offsetWidth !== target.offsetWidth)
      clone.style.width = target.offsetWidth + 'px'
  }

  function handleInput({ target }: { target: HTMLTextAreaElement }) {
    const clone = target.previousElementSibling as HTMLTextAreaElement
    if (!clone) return
    window.requestAnimationFrame(() => {
      const lines = (clone.scrollHeight / 24) | 0
      setLines(lines)
    })
  }

  return (
    <>
      <S.Clone value={value} readOnly />
      <S.Input
        onKeyDown={handleKey}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        ref={ref}
        lines={lines}
        // @ts-ignore
        onInput={handleInput}
      />
    </>
  )
}

interface ScProps {
  lines?: number
}

const Input = styled.textarea<ScProps>`
  width: 100%;
  resize: none;
  display: block;
  box-sizing: border-box;
  margin-top: 1.5rem;
  padding: 0.5rem;
  position: relative;
  z-index: 600;
  background-color: #f1f3f4;
  border: 1.2px solid #f1f3f4;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
  color: #444;
  font-size: 1rem;
  line-height: 1.5;
  height: calc(${p => (p?.lines ?? 1) * 1.5}em + 1rem + 2.4px);

  &:focus {
    outline: none;
    background-color: #fff;
    border-color: #666;
  }
`

const S = {
  Wrap: styled.div`
    position: relative;
    width: 100%;
    display: block;
  `,

  Clone: styled(Input)`
    height: 0;
    visibility: hidden;
    position: absolute;
  `,

  Input,
}
