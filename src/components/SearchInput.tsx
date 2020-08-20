import React from 'react'
import styled from 'styled-components'
import { Icon, TagInput } from 'components'

interface Props {
  value: string
  onChange(v: string): void
  onSubmit?(): void
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  ...props
}: Props & Optional<Omit<React.HTMLProps<HTMLInputElement>, keyof Props>>) {
  return (
    <S.Search>
      <TagInput value={value} onChange={onChange} {...props} />
      <Icon
        icon="search"
        onClick={({ target }) => {
          if (value && onSubmit) onSubmit()
          else;
          ;((target as HTMLImageElement)?.parentNode?.querySelector(
            'input'
          ) as HTMLInputElement)?.focus()
        }}
      />
    </S.Search>
  )
}

const S = {
  Search: styled.div`
    width: 100%;
    border-radius: 1000px;
    overflow: hidden;
    display: flex;
    align-items: center;
    background-color: #f1f3f4;
    transition: background-color 0.25s ease;

    &:focus,
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }

    svg {
      margin-right: 1rem;
    }

    input {
      width: 0;
    }

    & > div {
      background-color: transparent;

      input {
        margin-left: 0.5rem;
        background-color: transparent;

        &:focus,
        &:hover {
          background-color: transparent;
        }

        &::placeholder {
          color: var(--cl-text-medium);
        }
      }
    }

    svg[data-mode~='clickable'] {
      margin-right: 1rem;
      flex-shrink: 0;
      border-radius: 0;
      width: 1.2rem;
      height: 1.2rem;

      &:hover {
        background-color: initial;
      }
    }
  `,
}
