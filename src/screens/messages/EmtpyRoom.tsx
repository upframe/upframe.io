import React from 'react'
import styled from 'styled-components'
import { Title, Text, Button } from 'components'

export default function EmptyRoom({ onToggleSelect }) {
  return (
    <S.Empty>
      <picture>
        <source
          srcSet={process.env.REACT_APP_ASSETS + 'postbox.webp'}
          type="image/webp"
        />
        <source
          srcSet={process.env.REACT_APP_ASSETS + 'postbox.jpg'}
          type="image/jpeg"
        />
        <img
          src={process.env.REACT_APP_ASSETS + 'postbox.jpg'}
          alt="postbox illustration"
        />
      </picture>
      <Title size={2}>There are no dumb questions.</Title>
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

    picture {
      display: contents;
    }

    img {
      width: 24rem;
      max-width: 100%;
      height: auto;
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
