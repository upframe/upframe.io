import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Dropdown } from 'components'
import { useQuery, useMutation } from 'gql'
import type * as T from 'gql/types'
import { MEMBER_QUERY, MEMBER_INFO, REMOVE_MEMBER, CHANGE_ROLE } from './gql'
import api from 'api'

interface Props {
  spaceId: string
  userId: string
  onUpdate(): void
}

export default function MemberContext({ spaceId, userId, onUpdate }: Props) {
  const [open, setOpen] = useState(false)

  const { data, loading } = useQuery<T.MemberInfo, T.MemberInfoVariables>(
    MEMBER_INFO,
    {
      variables: { spaceId, userId },
      skip: !open,
    }
  )

  const { isMentor, isOwner } = data?.space ?? {}

  const [remove] = useMutation(REMOVE_MEMBER, {
    variables: { spaceId, userId },
    update(cache) {
      const data = cache.readQuery<T.SpaceMembers>({
        query: MEMBER_QUERY,
        variables: { spaceId },
      })
      if (!data?.space) return
      cache.writeQuery({
        query: MEMBER_QUERY,
        variables: { spaceId },
        data: {
          ...data,
          space: {
            ...data.space,
            members: data.space.members?.filter(({ id }) => id !== userId),
            mentors: data.space.mentors?.filter(({ id }) => id !== userId),
            owners: data.space.owners?.filter(({ id }) => id !== userId),
          },
        },
      })
    },
  })

  const changeRole = (
    args: Omit<T.ChangeMemberRoleVariables, 'space' | 'user'>
  ) =>
    api
      .mutate<T.ChangeMemberRole, T.ChangeMemberRoleVariables>({
        mutation: CHANGE_ROLE,
        variables: { space: spaceId, user: userId, ...args },
      })
      .then(() => {
        const data = api.cache.readQuery<T.SpaceMembers>({
          query: MEMBER_QUERY,
          variables: { spaceId },
        })
        const { space } = data ?? {}
        if (!space) return
        const users = ['members', 'mentors', 'owners'].flatMap(
          group => space?.[group] ?? []
        )
        const user = users.find(({ id }) => id === userId)
        ;['members', 'mentors', 'owners'].forEach(group => {
          if (!space?.[group]) return
          space[group] = space[group]?.filter(v => v !== user)
        })
        if (args.owner) space.owners = [...(space.owners ?? []), user]
        else if (args.mentor) space.mentors = [...(space.mentors ?? []), user]
        else space.members = [...(space.members ?? []), user]
        ;['members', 'mentors', 'owners'].forEach(group => {
          space[group].sort((a, b) => a.name.localeCompare(b.name))
        })
        api.cache.writeQuery({
          query: MEMBER_QUERY,
          variables: { spaceId },
          data,
        })

        onUpdate()

        const info = api.cache.readQuery<T.MemberInfo>({
          query: MEMBER_INFO,
          variables: { spaceId, userId },
        })
        if (!info?.space) return

        if ('owner' in args) info.space.isOwner = args.owner as boolean
        if ('mentor' in args) info.space.isMentor = args.mentor as boolean

        api.cache.writeQuery({
          query: MEMBER_INFO,
          variables: { spaceId, userId },
          data: info,
        })
      })

  return (
    <S.Wrap>
      <Icon icon="more" onClick={() => setOpen(!open)} />
      {open && !loading && data?.space && (
        <Dropdown
          onClose={() => setTimeout(() => setOpen(false), 100)}
          onClick={key => {
            if (!data.space) return
            if (key === 'remove') return remove()
            if (key === 'mentor') return changeRole({ mentor: !isMentor })
            if (key === 'owner') return changeRole({ owner: !isOwner })
          }}
        >
          <span key="mentor">
            {isMentor ? 'Remove from' : 'Add to'} mentor list
          </span>
          <span key="owner">{isOwner ? 'Revoke' : 'Grant'} owner access</span>
          <span key="remove">Remove from space</span>
        </Dropdown>
      )}
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    margin-left: 1rem;
    position: relative;

    ol {
      left: unset;
      right: 0;
      font-size: 0.9rem;
    }
  `,
}
