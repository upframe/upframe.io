import React from 'react'
import styled from 'styled-components'
import Spinner from './Spinner'

export default function Checkbox({
  onChange,
  checked,
  color,
  loading = false,
}) {
  if (loading) return <Spinner color={color || '#2c3976'} />
  return (
    <S.Checkbox
      type="checkbox"
      checked={checked || false}
      onChange={({ currentTarget }) => {
        onChange(currentTarget.checked)
      }}
      style={color && { backgroundColor: color, borderColor: color }}
      data-colored={color}
    />
  )
}

const S = {
  Checkbox: styled.input`
    appearance: none;
    display: inline-block;
    position: relative;
    width: 1.375rem;
    height: 1.375rem;
    border: 2px solid var(--cl-text-light);
    border-radius: 0.25rem;
    margin: 0;
    cursor: pointer;
    overflow: hidden;

    &:checked {
      background-color: var(--cl-secondary);
      border-color: var(--cl-secondary);
      background-image: url('/media/checkmark.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: 60%;
    }

    &:focus {
      outline: none;
    }

    &[data-colored] {
      &:not(:checked) {
        background-color: initial !important;
      }
    }

    ${Spinner.sc} {
      --size: 3rem;

      width: var(--size) !important;
      height: var(--size) !important;

      --off: calc((var(--size) - 1.375rem) / 2 * -1);

      margin: var(--off) !important;
    }
  `,
}
