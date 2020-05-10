import React from 'react'
import styled from 'styled-components'
import { Card, ProfilePicture, Title, Text } from '.'
import { gql, useQuery, fragments } from 'gql'
import { Link } from 'react-router-dom'

const RECOMMENDATIONS = gql`
  query Recommendations($handles: [String]) {
    users(handles: $handles) {
      ...MentorProfile
    }
  }
  ${fragments.person.mentorProfile}
`

export default function RecommendationCard({ recommendations: handles }) {
  const { data: { users = [] } = {} } = useQuery(RECOMMENDATIONS, {
    variables: { handles },
    skip: !handles?.length,
  })

  return (
    <Card>
      <Title s3>Other mentors who can help</Title>
      <S.List>
        {users.map(
          ({ id, name, handle, profilePictures: imgs, title, company }) => (
            <S.User key={id} to={`/${handle}`}>
              <ProfilePicture imgs={imgs} size="6.5rem" />
              <div>
                <Title s3>{name}</Title>
                <Text>
                  {title}
                  {company ? ` at ${company}` : ''}
                </Text>
              </div>
            </S.User>
          )
        )}
      </S.List>
    </Card>
  )
}

const S = {
  List: styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2.5rem;

    @media (max-width: 1200px) {
      flex-direction: column;

      & > a:first-of-type {
        margin-right: 0;
        margin-bottom: 1.5rem;
      }
    }
  `,

  User: styled(Link)`
    display: flex;
    flex-basis: 0;
    flex-grow: 1;

    &:first-of-type {
      margin-right: 1rem;
    }

    img {
      width: 6.5rem;
      height: 6.5rem;
      flex-shrink: 0;
      border-radius: calc(var(--border-radius) / 2);
    }

    & > div {
      margin-left: 1rem;
      display: flex;
      flex-direction: column;

      h3,
      p {
        margin: 0;
      }

      p {
        margin-top: 0.5rem;
      }
    }
  `,
}
