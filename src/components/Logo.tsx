import React from 'react'
import styled from 'styled-components'
import Link from './Link'
import { useMentors } from 'utils/hooks'

export default function Logo({ home = false, onClick }) {
  const { set: shuffle } = useMentors()

  const img = (
    <S.Logo viewBox="0 0 595.3 598.5">
      <g>
        <path d="M188.1,444.5l65.3-147.1l59.8-14.6c9.8-2.4,20.2,1.6,25.1,9.5l41.6,67.8L188.1,444.5z" />
        <path d="M205.9,359.4l-54.9-37.1l85.3-20.8l-27.2,57.1C208.6,359.8,207,360.2,205.9,359.4z" />
        <path d="M292.9,414.2l77.7-34.2l-32.6,68.7l-45.5-30.8C291.1,416.9,291.3,414.9,292.9,414.2z" />
        <path
          d="M313.8,228.9L387.3,344l20.3-42.2c2.8-5.9,1.7-12.6-2.8-17.5l-69.3-82.4l-20.7,19.6
			C312.7,223.5,312.2,226.5,313.8,228.9z"
        />
        <path
          d="M307.4,206.3l0.1-0.1c0.1-0.1,0.2-0.2,0.3-0.4l62.3-60.3l-17,5.4c-5.2,1.6-10.5,3.3-15.7,4.8
			c-10.3,3.2-21,6.4-31.2,9.9c-7.6,2.6-6.9,9.1-6.3,15.4c0.1,0.9,0.2,1.9,0.2,2.7l1.5,20.8c0.2,3.6,0.7,7.2,2.7,10.4
			C303.6,211.9,305.1,208.7,307.4,206.3z"
        />
      </g>
    </S.Logo>
  )

  if (!home) return img
  return (
    <Link
      wrap
      to="/"
      onClick={e => {
        if (window.location.pathname === '/') e.preventDefault()
        shuffle()
        if (onClick) onClick()
      }}
    >
      {img}
    </Link>
  )
}

const S = {
  Logo: styled.svg`
    height: 4.5rem;

    path {
      fill: #ff205c;
    }

    &:hover {
      opacity: 0.8;
      transition: transform 0.125s ease, opacity 0.125s ease;
      transform: scale(1.05);
    }
  `,
}
