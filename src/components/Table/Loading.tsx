import React from 'react'
import styled from 'styled-components'

interface Props {
  rows: number
}

export default function Loading({ rows }: Props) {
  return (
    <S.Loading rows={rows}>
      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <div key={`loading-${i}`} />
        ))}
    </S.Loading>
  )
}

const S = {
  Loading: styled.div<{ rows: number }>`
    & > div {
      display: block;
      width: 100%;
      height: var(--row-height);
      opacity: 0;
      animation: fade 2s linear 0s infinite;

      &:nth-of-type(2n) {
        background-color: #dceffd;
      }

      &:nth-of-type(2n + 1) {
        background-color: #cfe8fc;
      }

      /* stylelint-disable-next-line */
      ${({ rows }) =>
        Array(rows)
          .fill(0)
          .map(
            (_, i) => `
              &:nth-of-type(${i + 1}n) {
                animation-delay: ${(i / (rows * 3)) * 2}s;
              }`
          )
          .join('\n')}
    }

    @keyframes fade {
      0%,
      20% {
        opacity: 0;
      }

      10% {
        opacity: 0.8;
      }
    }
  `,
}
