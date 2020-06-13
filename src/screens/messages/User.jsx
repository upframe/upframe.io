import React from 'react'
import styled from 'styled-components'
import { ProfilePicture, Title, Text, Checkbox } from 'components'

export default function User({
  name,
  headline,
  profilePictures,
  selected,
  onSelect,
}) {
  return (
    <S.User
      {...(typeof onSelect === 'function' && {
        onClick: () => onSelect(!selected),
      })}
    >
      <ProfilePicture imgs={profilePictures} size="3rem" />
      <S.TextSec>
        <Title s4>{name}</Title>
        <Text>{headline ?? '\u00a0'}</Text>
      </S.TextSec>
      {typeof onSelect === 'function' && (
        <Checkbox checked={selected} onChange={onSelect} />
      )}
    </S.User>
  )
}

const S = {
  User: styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    margin: 1rem 0;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    min-width: 0;
    box-sizing: border-box;
    user-select: none;

    picture,
    img {
      border-radius: 50%;
    }

    &:hover {
      background-color: #0000000c;
    }

    input {
      flex-shrink: 0;
      margin-left: 0.5rem;
    }
  `,

  TextSec: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    flex-grow: 1;
    padding-left: 1rem;
    box-sizing: border-box;
    min-width: 0;

    * {
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      flex: 0 1 auto;
    }
  `,
}
