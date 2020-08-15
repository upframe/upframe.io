import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import type { Lists } from 'gql/types'

interface Props {
  list: Lists['lists'][number]
}

export default function ListCard({ list }: Props) {
  return (
    <S.Card
      to={`/${list.name}`}
      style={{
        backgroundColor: list.backgroundColor ?? 'var(--cl-secondary)',
        color: list.textColor ?? '#fffc',
      }}
    >
      <S.Title>{list.name}</S.Title>
      {list.illustration && <S.Illustration src={list.illustration} />}
    </S.Card>
  )
}

const S = {
  Card: styled(Link)`
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 2rem;
    box-sizing: border-box;
    width: var(--list-width);
    height: 100%;
    background-color: var(--cl-secondary);
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

  Title: styled.span`
    font-size: 1.5rem;
    max-width: 60%;
  `,

  Illustration: styled.img`
    position: absolute;
    height: 100%;
    right: 0;
    bottom: 0;
  `,
}
