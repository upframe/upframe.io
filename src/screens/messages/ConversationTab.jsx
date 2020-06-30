import React from 'react'
import styled from 'styled-components'
import { ProfilePicture, Title, Text, Checkbox, Identicon } from 'components'
import { useMe } from 'utils/hooks'
import { Link } from 'react-router-dom'
import { path } from 'utils/url'

export default function User({ id, selected, onSelect, users = [] }) {
  const { me } = useMe()
  users = users.filter(({ id }) => id !== me.id)

  const CondLink = id ? Link : React.Fragment

  if (!users.length) return null
  return (
    <S.User
      {...(typeof onSelect === 'function' && {
        onClick: () => onSelect(!selected),
      })}
    >
      <CondLink {...(id && { to: `${path(1)}/${id}` })}>
        {users.length > 1 ? (
          <Identicon ids={users.map(({ id }) => id)} />
        ) : (
          <ProfilePicture imgs={users[0]?.profilePictures} size="3rem" />
        )}
        <S.TextSec>
          <Title s4>
            {users.length === 1
              ? users[0].name
              : users.map(({ name }) => name.split(' ')[0]).join(', ')}
          </Title>
          <Text>
            {users.length > 1
              ? `${users.length + 1} participants`
              : users[0]?.headline ?? '\u00a0'}
          </Text>
        </S.TextSec>
        {typeof onSelect === 'function' && (
          <Checkbox checked={selected} onChange={onSelect} />
        )}
      </CondLink>
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

    & > a {
      display: contents;
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
