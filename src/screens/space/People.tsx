import React from 'react'
import styled from 'styled-components'
import { gql, useQuery, fragments } from 'gql'
import { Title, Text, Spinner, ProfilePicture } from 'components'
import type { SpaceMembers, SpaceMembersVariables } from 'gql/types'

const MEMBER_QUERY = gql`
  query SpaceMembers($spaceId: ID!) {
    space(id: $spaceId) {
      id
      owners {
        ...SpaceMember
      }
      mentors(includeOwners: false) {
        ...SpaceMember
      }
      members {
        ...SpaceMember
      }
    }
  }

  fragment SpaceMember on Person {
    id
    name
    handle
    headline
    ...ProfilePictures
  }

  ${fragments.person.profilePictures}
`

export default function People({ spaceId }: { spaceId: string }) {
  const { data } = useQuery<SpaceMembers, SpaceMembersVariables>(MEMBER_QUERY, {
    variables: { spaceId },
  })

  if (!data?.space) return <Spinner />
  return (
    <S.People>
      <Group
        title="Owners"
        description="Owners can manage this space and invite new members."
        users={data.space.owners ?? []}
      />
      <Group
        title="Mentors"
        description="Mentors can see content in this space and add slots to their profile."
        users={data.space.mentors ?? []}
      />
      <Group
        title="Founders"
        description="Founders can see content in this space and book calls with mentors."
        users={data.space.members ?? []}
      />
    </S.People>
  )
}

interface GroupProps {
  title: string
  description: string
  users: Exclude<Exclude<SpaceMembers['space'], null>['owners'], null>
}

function Group({ title, description, users }: GroupProps) {
  return (
    <S.Group>
      <Title size={3}>
        {title}
        <span>{users.length}</span>
      </Title>
      <Text>{description}</Text>
      <ol>
        {users.slice(0, 4).map(({ id, name, headline, profilePictures }) => (
          <S.User key={id}>
            <ProfilePicture size={avatarSize} imgs={profilePictures} />
            <div>
              <Title size={4}>{name}</Title>
              <Text>{headline}</Text>
            </div>
          </S.User>
        ))}
      </ol>
    </S.Group>
  )
}

const avatarSize = '2.8rem'

const S = {
  People: styled.div``,

  Group: styled.div`
    &:not(:first-of-type) {
      margin-top: 1.5rem;
    }

    h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #000;

      span {
        font-size: 1.1rem;
        color: var(--cl-text-light);
        white-space: pre;

        &::before {
          content: '  ';
        }
      }
    }

    ol {
      list-style: none;
      padding: 0;
    }

    & > p {
      margin-top: 0;
      font-size: 0.94rem;
    }
  `,

  User: styled.li`
    display: flex;
    margin: 1rem 0;

    picture,
    img {
      width: ${avatarSize};
      height: ${avatarSize};
      border-radius: 50%;
    }

    & > div {
      display: flex;
      flex-direction: column;
      margin-left: 1rem;
      justify-content: space-around;

      * {
        margin: 0;
        line-height: 1rem;
      }

      p {
        font-size: 0.9rem;
      }
    }

    &:nth-child(4n) {
      opacity: 0.5;
    }
  `,
}
