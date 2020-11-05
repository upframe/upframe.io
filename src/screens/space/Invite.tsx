import React, { useState } from 'react'
import styled from 'styled-components'
import roles, { Role } from './roles'
import { isEmail } from 'utils/validate'
import { useQuery, useMutation } from 'gql'
import type * as T from 'gql/types'
import * as C from 'components'
import * as gql from './gql'
import api from 'api'

interface Props {
  onClose(): void
  name: string
  role: Role
  spaceId: string
  spaceName: string
}

const tabs = ['Invite via Email', 'Invite via Link']

const formatter =
  'ListFormat' in Intl
    ? new (Intl as any).ListFormat('en', {
        style: 'long',
        type: 'conjunction',
      })
    : undefined

const formatInvalid = (items: string[]) => {
  items = items.map(v => `"${v}"`)
  const list = formatter?.format(items) ?? items.join(', ')
  const multi = items.length > 1
  return `${list} ${multi ? 'are' : 'is'} not ${
    multi ? '' : 'a '
  } valid email address${multi ? 'es' : ''}`
}

export function InviteMenu({ onClose, role, name, spaceId, spaceName }: Props) {
  const [tab, setTab] = useState(tabs[0])
  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [invalid, setInvalid] = useState<string[]>([])

  const { data, loading: linksLoading } = useQuery(gql.INVITE_LINKS, {
    variables: { space: spaceId },
  })
  const links = data?.space?.inviteLinks ?? {}
  const hasLink = links[role.slice(0, -1).toLowerCase()]

  function handleEmailInput(v: string) {
    if (/[\s,;]/.test(v)) {
      setEmailInput('')
      const newEmails = v
        .split(/[\s,;]/)
        .map(v => v.trim())
        .filter(Boolean)
      setEmails(Array.from(new Set([...emails, ...newEmails])))
      setInvalid([...invalid, ...newEmails.filter(v => !isEmail(v))])
    } else setEmailInput(v)
  }

  function removeEmail(email: string) {
    setEmails(emails.filter(v => v !== email))
    setInvalid(invalid.filter(v => v !== email))
  }

  function inputValid() {
    if (emails.length === 0 && !emailInput) return false
    if (invalid.length > 0) return false
    if (emailInput.length && !isEmail(emailInput)) return false
    return true
  }

  const [createLink, { loading: createLoading }] = useMutation<
    T.CreateSpaceInvite,
    T.CreateSpaceInviteVariables
  >(gql.CREATE_INVITE, {
    variables: {
      space: spaceId,
      role: role
        .slice(0, -1)
        .toUpperCase() as T.CreateSpaceInviteVariables['role'],
    },
    update(cache, res) {
      if (!res.data) return
      data.space.inviteLinks[role.slice(0, -1).toLowerCase()] =
        res.data.createSpaceInvite
      cache.writeQuery({
        query: gql.INVITE_LINKS,
        variables: { space: spaceId },
        data,
      })
    },
  })

  const [revokeLink, { loading: revokeLoading }] = useMutation(
    gql.REVOKE_INVITE,
    {
      variables: {
        space: spaceId,
        role: role
          .slice(0, -1)
          .toUpperCase() as T.CreateSpaceInviteVariables['role'],
      },
      update(cache) {
        data.space.inviteLinks[role.slice(0, -1).toLowerCase()] = null
        cache.writeQuery({
          query: gql.INVITE_LINKS,
          variables: { space: spaceId },
          data,
        })
      },
    }
  )

  const [inviteEmails, { loading: inviteLoading }] = useMutation<
    T.InviteToSpace,
    T.InviteToSpaceVariables
  >(gql.INVITE_EMAILS)

  function toggleLink() {
    if (!hasLink) createLink()
    else revokeLink()
  }

  async function invite() {
    const invite = [...emails, emailInput].filter(Boolean)
    const inviteRole = role.slice(0, -1).toUpperCase() as any

    await inviteEmails({
      variables: {
        emails: invite,
        space: spaceId,
        role: inviteRole,
      },
    })

    const query = {
      query: gql.MEMBER_QUERY,
      variables: { spaceId },
    }
    try {
      const data = api.cache.readQuery<T.SpaceMembers>(query)
      if (data?.space) {
        data.space.invited = [
          ...(data?.space.invited ?? []),
          ...invite.map(email => ({
            email,
            issued: new Date().toISOString(),
            role: inviteRole,
            __typename: 'Invited' as any,
          })),
        ]
        api.cache.writeQuery({ ...query, data })
      }
    } catch (e) {
      window.location.reload()
    }

    onClose()
  }

  return (
    <C.Modal onClose={onClose} title={`Invite ${role} to ${name}`}>
      <S.Invite>
        <C.Navbar tabs={tabs} active={tab} onNavigate={setTab} />
        {tab === tabs[0] && (
          <div>
            <C.Text>
              You can also paste multiple emails at once if they are seperated
              by a space, comma, semicolon or newline.
            </C.Text>
            <C.Tagarea
              input={emailInput}
              onChange={handleEmailInput}
              tags={emails}
              onTagClick={removeEmail}
            />
            {invalid.length > 0 && <S.Error>{formatInvalid(invalid)}</S.Error>}
            <C.Button
              accent
              onClick={invite}
              disabled={!inputValid()}
              loading={inviteLoading}
            >
              Send invites
            </C.Button>
          </div>
        )}
        {tab === tabs[1] &&
          (linksLoading ? (
            <C.Spinner />
          ) : (
            <div>
              <C.Labeled
                label="Enable Invite Link"
                action={
                  <C.Checkbox
                    checked={hasLink}
                    onChange={toggleLink}
                    loading={createLoading || revokeLoading}
                  />
                }
                wrap={S.CheckWrap}
              />
              {hasLink && (
                <>
                  <C.Text>
                    Share this link with others to invite them as{' '}
                    {role.toLowerCase()} to {spaceName}.
                  </C.Text>
                  <C.CopyField
                    value={`${window.location.origin}/join/${
                      links[role.slice(0, -1).toLowerCase()]
                    }`}
                  />
                </>
              )}
            </div>
          ))}
      </S.Invite>
    </C.Modal>
  )
}

export function InviteButton({ onSelect }: { onSelect: (v?: Role) => void }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <S.BtWrap>
      <C.Button
        accent
        filled
        onClick={() => setShowDropdown(true)}
        disabled={showDropdown}
      >
        Invite
      </C.Button>
      {showDropdown && (
        <C.Dropdown
          onClick={(v: Role) => {
            setShowDropdown(false)
            onSelect(v)
          }}
          onClose={() => setShowDropdown(false)}
        >
          {Object.entries(roles).map(([k, v]) => (
            <S.Role key={k}>
              <C.Title size={4}>{k}</C.Title>
              <C.Text>{v}</C.Text>
            </S.Role>
          ))}
        </C.Dropdown>
      )}
    </S.BtWrap>
  )
}

const S = {
  BtWrap: styled.div`
    position: relative;
  `,

  Role: styled.div`
    h4 {
      margin: 0;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
    }
  `,

  Invite: styled.div`
    nav {
      width: 100%;
      margin-top: 0;
    }

    & > div {
      display: flex;
      flex-direction: column;

      & > button {
        margin-top: 1.5rem;
        align-self: flex-end;
      }
    }
  `,

  Error: styled.span`
    color: var(--cl-error);
  `,

  CheckWrap: styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;

    label {
      margin-left: 1rem;
    }
  `,
}
