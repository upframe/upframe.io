import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Icon } from 'components'
import { useMatchMedia } from 'utils/hooks'
import { mobile } from 'styles/responsive'
import { useHistory } from 'react-router'
import { path } from 'utils/url'

interface Props {
  onSubmit(v: string): void
  placeholder?: string
  channelId?: string
  autoFocus?: boolean
}

export default function MsgInput({
  onSubmit = () => {},
  placeholder,
  channelId,
  autoFocus,
}: Props) {
  const [value, setValue] = useState('')
  const ref = useRef() as React.MutableRefObject<HTMLTextAreaElement>
  const [lines, setLines] = useState(1)
  const [valid, setValid] = useState(false)
  const isMobile = useMatchMedia(mobile)
  const history = useHistory()

  function submit(e?: React.FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault()
    if (!valid) return
    onSubmit(value)
    setValue('')
    setValid(false)
    setLines(1)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (e.shiftKey) {
          setLines(lines + 1)
          const textarea: HTMLTextAreaElement = e.target as any
          const cursor = textarea.selectionStart
          requestAnimationFrame(() => {
            if (!textarea) return
            setValue(value.slice(0, cursor) + '\n' + value.slice(cursor))
            textarea.setSelectionRange(cursor + 1, cursor + 1)
          })
          return setValue(value + '\n')
        }
        submit()
        break
      default:
    }
  }

  function handleChange({ target }: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(target.value)
    setValid(target.value.length > 0 && /[^\s\n]/.test(target.value))

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

  function onFocus() {
    const [, , , channel] = window.location.pathname.split('/')
    if (channel || !channelId) return
    history.push(`${path()}/${channelId}?focus=true`)
  }

  return (
    <S.Wrap onSubmit={submit}>
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
        data-valid={valid}
        {...(isMobile && { onFocus })}
        autoFocus={autoFocus}
      />
      <S.Send>
        <Icon icon="send" onClick={() => submit()} clickStyle={false} />
      </S.Send>
    </S.Wrap>
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
  padding-right: 2.5rem;
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
  Wrap: styled.form`
    position: relative;
    width: 100%;
    display: block;
  `,

  Clone: styled(Input)`
    height: 0;
    visibility: hidden;
    position: absolute;
  `,

  Send: styled.div`
    position: absolute;
    z-index: 800;
    width: 21px;
    height: 18px;
    overflow: hidden;
    transform: translateY(calc(-50% - (1.5em + 1rem + 2.4px) / 2));
    right: 0.5rem;
    opacity: 0.4;
    transition: fill 0.15s ease, opacity 0.15s ease;

    textarea[data-valid='true'] + & {
      fill: var(--cl-accent);
      opacity: 1;
      cursor: pointer;
    }
  `,

  Input,
}
