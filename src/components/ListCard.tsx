import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import type { Lists } from 'gql/types'
import { mobile } from 'styles/responsive'

interface Props {
  list: Lists['lists'][number]
}

export default function ListCard({ list }: Props) {
  return (
    <S.Card
      to={`/list/${list.name.replace(/\s/g, '_')}`}
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
    --margin: calc(100vw - var(--max-home-width));

    position: relative;
    display: flex;
    align-items: center;
    padding-left: 1.5rem;
    padding-left: min(1.5rem, 3.64vw);
    box-sizing: border-box;
    width: var(--list-width);
    height: 100%;
    background-color: var(--cl-secondary);
    border-radius: 1rem;
    flex-shrink: 0;
    scroll-snap-align: start;
    user-select: none;
    overflow: hidden;
    transition: box-shadow 0.2s ease;

    &:not(:first-of-type) {
      margin-left: 1.7rem;
      margin-left: min(1.7rem, var(--margin));
    }

    &:last-of-type {
      overflow: visible;

      img {
        border-bottom-right-radius: inherit;
      }
    }

    &:last-of-type::after {
      content: '';
      position: absolute;
      left: 100%;
      height: 100%;
      width: 1.7rem;
      width: min(1.7rem, var(--margin));
      background-color: transparent;
    }

    @media (hover: hover) {
      &:hover {
        filter: saturate(1.2);
        box-shadow: #0004 0 0 3.75px, #0002 0 3.75px 3.75px 0.3px;
      }
    }

    @media ${mobile} {
      border-radius: 0.5rem;
    }
  `,

  Title: styled.span`
    font-weight: 600;
    font-size: 1.28rem;
    font-size: min(4.12vw, 1.28rem);
    max-width: 60%;
  `,

  Illustration: styled.img`
    position: absolute;
    height: 100%;
    right: 0;
    bottom: 0;
  `,
}
