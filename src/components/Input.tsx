import React from 'react'
import styled from 'styled-components'

interface Props {
  type?: string
  id?: string
  value?: string
  onChange?(v: string): void
  changeTarget?: boolean
  placeholder?: string
  error?: boolean
}

const Input: React.FunctionComponent<
  Omit<React.HTMLProps<HTMLInputElement>, keyof Props> & Props
> = ({
  type = 'text',
  id,
  value = '',
  onChange = () => {},
  changeTarget,
  placeholder,
  error = false,
  ...props
}) => (
  <S.Input
    data-validity={error ? 'error' : undefined}
    id={id}
    value={value}
    onChange={({ target }) =>
      onChange((changeTarget ? target : target.value) as any)
    }
    placeholder={placeholder}
    type={type}
    {...(type === 'text' && { 'data-lpignore': true })}
    {...(props as any)}
  />
)

const S = {
  Input: styled.input`
    border-radius: var(--border-radius);
    padding: 0.7rem 1rem;
    color: var(--cl-text-medium);
    font: inherit;
    font-size: 1.2rem;
    box-sizing: border-box;
    background-color: #f1f3f4;
    border: none;

    &::placeholder {
      color: var(--cl-text-light);
    }

    transition: background-color 0.25s ease;

    &:focus,
    &:hover {
      outline: none;
      background-color: rgba(0, 0, 0, 0.08);
    }

    &[data-validity~='error'] {
      border: 1px solid var(--cl-error);
    }
  `,
}
export default Object.assign(Input, { sc: S.Input })
