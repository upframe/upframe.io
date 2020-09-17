import React from 'react'
import styled from 'styled-components'
import { Icon } from 'components'

interface Props {
  value: string
  onChange(v: string): void
  onSearch(term: string): void
}

export default function Search({ value, onChange, onSearch }: Props) {
  return (
    <S.SearchWrap>
      <S.SearchBar
        data-focus={false}
        onMouseDown={({ currentTarget }) =>
          requestAnimationFrame(() =>
            currentTarget.querySelector('input')?.focus()
          )
        }
        onSubmit={e => {
          e.preventDefault()
          onSearch(value)
        }}
      >
        <Icon icon="search" />
        <S.SearchInput
          placeholder="Search by name"
          onFocus={({ target }) =>
            ((target.parentElement as HTMLFormElement).dataset.focus = 'true')
          }
          onBlur={({ target }) =>
            ((target.parentElement as HTMLFormElement).dataset.focus = 'false')
          }
          value={value}
          onChange={({ target }) => onChange(target.value)}
        />
      </S.SearchBar>
    </S.SearchWrap>
  )
}

const S = {
  SearchWrap: styled.div`
    display: block;
    position: relative;
    margin-left: 1rem;

    --collapsed-size: 15em;

    flex: 1 0 var(--collapsed-size);
  `,

  SearchBar: styled.form`
    display: flex;
    align-items: center;
    height: 2rem;
    border: 1px solid var(--border-color-strong);
    border-radius: 0.25em;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding-left: 0.5em;
    box-sizing: border-box;
    width: 100%;

    --transition-time: 0.2s;

    transition: border-color var(--transition-time) ease;

    svg {
      width: 1em;
      height: 1em;
      margin-right: 0.3em;
      fill: var(--border-color-strong);
      transition: fill var(--transition-time) ease;
      cursor: pointer;
    }

    &::after {
      content: '';
      background: #fff;
      position: absolute;
      right: -2px;
      top: -2px;
      height: calc(100% + 4px);
      width: calc(100% - var(--collapsed-size) + 0.5em);
      transform-origin: right;
      transition: transform var(--transition-time) ease, opacity 0s 0.05s;
    }

    &::before {
      content: '';
      position: absolute;
      right: calc(100% - var(--collapsed-size) - 1px);
      top: -1px;
      height: 100%;
      width: 1rem;
      z-index: 2;
      border: 1px solid;
      border-color: inherit;
      border-left: none;
      border-top-right-radius: inherit;
      border-bottom-right-radius: inherit;
      transition: right var(--transition-time) ease, opacity 0s 0s;
    }

    &[data-focus='true']::after {
      transform: scaleX(0);
      opacity: 0;
      transition: transform var(--transition-time) ease,
        opacity 0s var(--transition-time);
    }

    &[data-focus='true']::before {
      right: 0;
      opacity: 0;
      transition: right var(--transition-time) ease,
        opacity 0s var(--transition-time);
    }

    &[data-focus='true'] {
      border-color: var(--cl-action-dark);
    }

    &[data-focus='true'] svg {
      fill: var(--cl-action-dark);
    }
  `,

  SearchInput: styled.input`
    flex-grow: 1;
    border: none;
    border-radius: inherit;
    font-family: inherit;
    font-size: 1em;
    color: var(--cl-text-strong);

    &:focus {
      outline: none;
    }
  `,
}
