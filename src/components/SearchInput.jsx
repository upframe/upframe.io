import React from 'react'
import styled from 'styled-components'
import { Icon, TagInput } from 'components'

export default function SearchInput({ value, onChange, onSubmit, ...props }) {
  return (
    <S.Search>
      <TagInput value={value} onChange={onChange} {...props} />
      <Icon
        icon="search"
        onClick={({ target }) =>
          value
            ? (onSubmit ?? (() => {}))()
            : target.parentNode.querySelector('input')?.focus()
        }
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
  `,
}
