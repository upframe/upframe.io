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

export default function Message({ content, author, time }) {
  const { data: { user = {} } = {} } = useQuery(USER_QUERY, {
    variables: { id: author },
  })

  return (
    <S.Wrap>
      <ProfilePicture imgs={user.profilePictures} size={picSize} />
      <S.Main>
        <S.Head>
          <S.Name>{user.name}</S.Name>
          <Time>{time}</Time>
        </S.Head>
        <S.Body>{content}</S.Body>
      </S.Main>
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.article`
    display: flex;
    flex-direction: row;
    border: 1px dotted red;
    padding: 0.5rem;

    &:hover {
      background-color: #eee6;
    }

    picture,
    img {
      width: ${picSize};
      height: ${picSize};
      flex-shrink: 0;
      border-radius: 1000px;
    }
  `,

  Main: styled.div`
    padding-left: 1rem;
  `,

  Head: styled.div`
    display: flex;
    flex-direction: row;
  `,

  Body: styled.p`
    margin: 0;
    margin-top: 0.2rem;
  `,

  Name: styled.span`
    margin-right: 1rem;
  `,
}
