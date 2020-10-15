import React from 'react'
import styled from 'styled-components'
import { gql, useQuery, fragments } from 'gql'
import { Title, Text, Spinner } from 'components'
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
      <Group title="Mentors" description="…" users={data.space.mentors ?? []} />
      <Group
        title="Founders"
        description="Founders can see content in the space and book calls with mentors."
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
      <Title size={3}>{title}</Title>
      <Text>{description}</Text>
      <ol>
        {users.map(({ id, name }) => (
          <S.User key={id}>{name}</S.User>
        ))}
      </ol>
    </S.Group>
  )
}

const S = {
  People: styled.div``,

  Group: styled.div`
    h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #000;
      margin-bottom: 0.5rem;
    }

    ol {
      list-style: none;
      padding: 0;
    }
  `,

  User: styled.li``,
}
