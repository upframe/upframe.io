import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface Props {
  name: String
}

export default function ListCard({ name }: Props) {
  return <S.Card to={`/${name}`} />
}

const S = {
  Card: styled(Link)`
    display: block;
    position: relative;
    width: var(--list-width);
    height: 100%;
    background: #888;
    border-radius: 1rem;
    flex-shrink: 0;
    scroll-snap-align: start;

    &:not(:first-of-type) {
      margin-left: 1.7rem;
      margin-left: min(1.7rem, 2.5vw);
    }

    &:last-of-type::after {
      content: '';
      position: absolute;
      left: 100%;
      height: 100%;
      width: 1.7rem;
      width: min(1.7rem, 2.5vw);
      background-color: transparent;
    }
  `,
}
