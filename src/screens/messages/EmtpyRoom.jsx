import React from 'react'
import styled from 'styled-components'
import { Icon, Title, Text, Button } from 'components'

export default function EmptyRoom({ onToggleSelect }) {
  return (
    <S.Empty>
      <Icon icon="add" onClick={() => onToggleSelect(true)} />
      <Title s2>We don't believe in dumb questions.</Title>
      <Text>
        Message someone new to get advice on what you're working on. Or pick an
        existing conversation.
      </Text>
      <Button filled onClick={() => onToggleSelect(true)}>
        New message
      </Button>
    </S.Empty>
  )
}

const S = {
  Empty: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    user-select: none;

    & > svg {
      width: 7rem;
      height: 7rem;
      background-color: #e5e5e5;
    }

    & > * {
      margin: 1rem 0;
    }

    & > p {
      margin-top: 0.2rem;
      width: 42ch;
    }

    & > button {
      margin-top: 1.5rem;
    }
  `,
}
