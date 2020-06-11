import React from 'react'
import styled from 'styled-components'
import { fragments, useQuery, gql } from 'gql'
import { ProfilePicture } from 'components'
import Time from './Time'

const USER_QUERY = gql`
  query ChatUser($id: ID!) {
    user(id: $id) {
      id
      name
      ...ProfilePictures
    }
  }
  ${fragments.person.profilePictures}
`

const picSize = '3.2rem'

export default function Message({ content, author, time, stacked = false }) {
  const { data: { user = {} } = {} } = useQuery(USER_QUERY, {
    variables: { id: author },
  })

  return (
    <S.Wrap {...(stacked && { 'data-stacked': true })}>
      {!stacked ? (
        <ProfilePicture imgs={user.profilePictures} size={picSize} />
      ) : (
        <Time>{time}</Time>
      )}
      <S.Main>
        {stacked ? (
          <div />
        ) : (
          <S.Head>
            <S.Name>{user.name}</S.Name>
            <Time>{time}</Time>
          </S.Head>
        )}
        <S.Body>{content}</S.Body>
      </S.Main>
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.article`
    display: flex;
    flex-direction: row;
    padding: 0.2rem;
    padding-top: 0.5rem;
    align-items: center;

    &[data-stacked='true'] {
      padding-top: 0.2rem;
    }

    picture,
    img {
      width: ${picSize};
      height: ${picSize};
      flex-shrink: 0;
      border-radius: 1000px;
    }

    & > ${Time.sc} {
      opacity: 0;
      width: ${picSize};
      text-align: right;
    }

    &:hover {
      background-color: #eee6;

      ${Time.sc} {
        opacity: initial;
      }
    }
  `,

  Main: styled.div`
    padding-left: 1rem;
  `,

  Head: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,

  Body: styled.p`
    margin: 0;
    margin-top: 0.2rem;
    color: #000c;
  `,

  Name: styled.span`
    margin-right: 1.1rem;
    color: #000;
    font-weight: 500;
  `,
}
