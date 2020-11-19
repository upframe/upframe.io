import React from 'react'
import styled from 'styled-components'
import { useMe } from 'utils/hooks'

const productHuntUrl = 'https://www.producthunt.com/upcoming/upframe'

interface SlotI {
  start: string
  selected: boolean
  onClick(string): void
}

export default function Slot({ start, onClick = () => {}, selected }: SlotI) {
  const { me } = useMe()

  const date = new Date(start)
  const time = date.toLocaleString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  })

  const Tag = !me ? 'a' : 'span'

  return (
    <Tag
      {...(!me && {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: productHuntUrl,
      })}
    >
      <TagContainer selected={selected} onClick={() => me && onClick(start)}>
        <div>
          <span>{time}</span>
        </div>
      </TagContainer>
    </Tag>
  )
}

const TagContainer = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  color: black;
  background-color: white;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 0 1rem;
  height: 4rem;
  width: 11rem;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: var(--cl-accent);
  }

  @media (max-width: 599px), (orientation: portrait) {
    width: 100%;
    margin-right: 0;
  }

  ${({ selected }) =>
    selected &&
    `
      color: var(--cl-accent);
    `}
`
