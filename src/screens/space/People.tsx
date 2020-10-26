import React, { useState } from 'react'
import styled from 'styled-components'
import { gql, useQuery, fragments } from 'gql'
import { Title, Text, Spinner, ProfilePicture, Button, Icon } from 'components'
import type { SpaceMembers, SpaceMembersVariables } from 'gql/types'
import roles, { Role } from './roles'

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

interface Props {
  spaceId: string
  onInvite(v: Role): void
}

export default function People({ spaceId, onInvite }: Props) {
  const { data } = useQuery<SpaceMembers, SpaceMembersVariables>(MEMBER_QUERY, {
    variables: { spaceId },
  })

  if (!data?.space) return <Spinner />
  return (
    <S.People>
      <Group
        title="Owners"
        description={roles.Owners}
        users={data.space.owners ?? []}
        onInvite={() => onInvite('Owners')}
      />
      <Group
        title="Mentors"
        description={roles.Mentors}
        users={data.space.mentors ?? []}
        onInvite={() => onInvite('Mentors')}
      />
      <Group
        title="Founders"
        description={roles.Founders}
        users={data.space.members ?? []}
        onInvite={() => onInvite('Founders')}
      />
    </S.People>
  )
}

interface GroupProps {
  title: string
  description: string
  users: Exclude<Exclude<SpaceMembers['space'], null>['owners'], null>
  onInvite(): void
}

function Group({ title, description, users, onInvite }: GroupProps) {
  const [batches, setBatches] = useState(1)
  const batchSize = 4

  const showMore = users.length > batches * batchSize
  const showCollapse = !showMore && users.length > batchSize

  return (
    <S.Group
      fade={
        users.length > batches * batchSize ? batches * batchSize : undefined
      }
    >
      <S.GroupHead>
        <div>
          <Title size={3}>
            {title}
            <span>{users.length}</span>
          </Title>
          <Text>{description}</Text>
        </div>
        <Button accent filled onClick={onInvite}>
          Invite
        </Button>
      </S.GroupHead>
      <ol>
        {users
          .slice(0, batches * batchSize)
          .map(({ id, name, headline, profilePictures }) => (
            <S.User key={id}>
              <ProfilePicture size={avatarSize} imgs={profilePictures} />
              <div>
                <Title size={4}>{name}</Title>
                <Text>{headline}</Text>
              </div>
              <S.UserActions>
                <Icon icon="mail" linkTo={`/conversations/new?parts=${id}`} />
              </S.UserActions>
            </S.User>
          ))}
      </ol>
      {(showMore || showCollapse) && (
        <S.LoadMore>
          {showMore && (
            <>
              <Button text onClick={() => setBatches(batches + 1)}>
                load more
              </Button>
              <Button text onClick={() => setBatches(Infinity)}>
                show all
              </Button>
            </>
          )}
          {showCollapse && (
            <Button text onClick={() => setBatches(1)}>
              collapse
            </Button>
          )}
        </S.LoadMore>
      )}
    </S.Group>
  )
}

const avatarSize = '2.8rem'

const S = {
  People: styled.div``,

  GroupHead: styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & > div {
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

        button {
          position: absolute;
          right: 0;
        }
      }

      p {
        margin-top: 0;
        font-size: 0.94rem;
      }
    }
  `,

  Group: styled.div<{ fade?: number }>`
    &:not(:first-of-type) {
      margin-top: 1.5rem;
    }

    ol {
      list-style: none;
      padding: 0;
    }

    /* stylelint-disable-next-line */
    ${({ fade }) =>
      !fade
        ? ''
        : `ol > li:nth-child(${fade}) {
      opacity: 0.5;
    }`}
  `,

  User: styled.li`
    display: flex;
    margin: 1rem 0;
    width: 100%;

    picture,
    img {
      width: ${avatarSize};
      height: ${avatarSize};
      border-radius: 50%;
    }

    & > div:first-of-type {
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
  `,

  UserActions: styled.div`
    margin-left: auto;
    padding-right: 1rem;

    svg {
      width: 1.4rem;
      height: 1.4rem;
      fill: var(--cl-text-medium);
    }
  `,

  LoadMore: styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
  `,
}
