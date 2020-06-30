import React from 'react'
import styled from 'styled-components'

interface Props {
  centered?: boolean
  color?: string
}

function Spinner({ centered = false, color }: Props) {
  return (
    <S.Spinner
      data-active={true}
      viewBox="0 0 100 100"
      {...(centered && { ['data-align']: 'center' })}
    >
      <circle
        cx="50"
        cy="50"
        r="20"
        strokeDashoffset={0.5 * 81.68141 * -1}
        {...(color && { style: { stroke: color } })}
      />
    </S.Spinner>
  )
}

const S = {
  Spinner: styled.svg`
    width: 5rem;
    height: 5rem;
    animation: rotate 2s linear infinite;
    transition: opacity 0.15s ease;
    transform-origin: center;

    &[data-active='false'] {
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    circle {
      fill: transparent;
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-width: 6;
      stroke-linecap: round;
      stroke: var(--cl-accent);
      animation: progress 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes progress {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }

      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
      }

      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
      }
    }

    &[data-align='center'] {
      position: fixed;
      left: calc(50vw - 2.5rem);
      top: calc(50vh - 2.5rem);
    }
  `,
}
export default Object.assign(Spinner, { sc: S.Spinner })
