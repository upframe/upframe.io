import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Text from './Text'

interface Props {
  children: ReactNode
  onClick?(v: ReactNode): void
  removable?: boolean
  highlight?: boolean
  link?: boolean
}

export default function Chip({
  children,
  onClick,
  removable = false,
  highlight,
  link = !removable,
}: Props) {
  return (
    <S.Chip
      as={link ? Link : 'div'}
      onClick={() => onClick?.(children)}
      {...(highlight && { 'data-highlight': true })}
      {...(link && { to: `/tag/${children}` })}
    >
      <Text>{children}</Text>
      {removable && <span>×</span>}
    </S.Chip>
  )
}

const S = {
  Chip: styled.div`
    display: flex;
    align-content: center;
    border: 1px solid #f5f5f5;
    padding: 0 1rem;
    height: 2rem;
    border-radius: 1rem;
    cursor: pointer;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    background-color: #fff;

    p {
      color: #000;
      line-height: 2rem;
      white-space: nowrap;
      margin: 0;
    }

    span {
      color: var(--cl-text-medium);
      margin: 0;
      margin-left: 0.5rem;
      line-height: 2rem;
    }

    &:hover,
    &[data-highlight] {
      background: #feeef2;
      box-shadow: 0 1px 4px #ffc9d8;

      p {
        color: #ff205c;
      }
    }
  `,
}
