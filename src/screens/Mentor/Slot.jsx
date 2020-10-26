import React from 'react'
import styled from 'styled-components'

export default function Slot({ start, onClick = () => {}, selected }) {
  const date = new Date(start)
  const time = date.toLocaleString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <TagContainer selected={selected} onClick={() => onClick(start)}>
      <div>
        <span>{time}</span>
      </div>
    </TagContainer>
  )
}

const TagContainer = styled.div`
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
