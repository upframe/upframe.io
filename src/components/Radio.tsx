import React from 'react'
import styled from 'styled-components'

interface Props {
  options: { label: string; id?: string; color?: string | null }[]
  selected?: string
  onSelect(v: string): void
}

export default function Radio({ options, selected, onSelect }: Props) {
  return (
    <S.Wrap>
      {options.flatMap(({ label, id = label, color }) => [
        <S.RadioButton
          key={`input-${id}`}
          id={id}
          type="radio"
          name="calendar"
          value={label}
          color={color ?? 'var(--cl-accent)'}
          checked={id === selected}
          onChange={() => onSelect(id)}
        />,
        <label key={`label-${id}`} htmlFor={id}>
          {label}
        </label>,
      ])}
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    display: grid;
    grid-template-columns: auto 1fr;

    * {
      align-self: center;
      cursor: pointer;
    }
  `,

  RadioButton: styled.input<{ color: string }>`
    position: relative;
    margin: 0;
    margin-right: 1rem;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid ${({ color }) => color};

    &,
    &::after {
      box-sizing: border-box;
    }

    &:focus,
    &:checked {
      outline: none;
    }

    &:checked::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      border-radius: 50%;
      background-color: ${({ color }) => color};

      /* must be even number of px (chrome rendering bug) */
      width: 9px;
      height: 9px;
    }
  `,
}
