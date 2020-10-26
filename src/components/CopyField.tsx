import React from 'react'
import styled from 'styled-components'
import Button from './Button'

const CopyField: React.FC<{ value: string }> = ({ value }) => (
  <S.CpField
    onClick={({ currentTarget, target }) => {
      const input = currentTarget.firstChild as any
      input.focus()
      input.select()
      document.execCommand('copy')
    }}
  >
    <input value={value} readOnly />
    <Button text>Copy</Button>
  </S.CpField>
)

const S = {
  CpField: styled.div`
    background-color: #f1f3f4;
    position: relative;
    height: 3.5rem;
    border-radius: 0.5rem;
    width: 100%;
    overflow: hidden;

    & > * {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin: 0;
      padding: 0;
    }

    button {
      right: 1rem;
    }

    input {
      color: var(--cl-text-medium);
      appearance: none;
      border: none;
      background-color: transparent;
      width: 100%;
      height: 100%;
      padding: 0 1rem;
      font: inherit;

      &:focus {
        outline: none;
      }
    }
  `,
}

export default Object.assign(CopyField, S)
