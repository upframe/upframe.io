import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Title, Labeled, Tagarea, Text, Button } from '../../components'
import { isEmail } from '../../utils/validate'
import { useMe } from '../../utils/hooks'
import { gql, useQuery, useMutation, fragments } from '../../gql'

const INVITE = gql`
  mutation Invite($emails: [String!]!, $role: Role) {
    invite(emails: $emails, role: $role) {
      ...PersonBase
      ...Invites
    }
  }
  ${fragments.person.base}
  ${fragments.person.invites}
`

const INVITES = gql`
  query invites($id: ID) {
    user(id: $id) {
      id
      ...Invites
    }
  }
  ${fragments.person.invites}
`

export default function Invite() {
  const [input, setInput] = useState('')
  const [tags, setTags] = useState([])
  const [invalid, setInvalid] = useState([])
  const [role, setRole] = useState('USER')
  const { me } = useMe()

  const { data: { user: { invites = [] } = {} } = {} } = useQuery(INVITES, {
    variables: { id: me.id },
    skip: !me,
  })

  const [invite] = useMutation(INVITE, {
    variables: { emails: [...tags, input].filter(Boolean), role },
    onCompleted() {
      setInput('')
      setTags([])
    },
  })

  useEffect(() => {
    setInvalid(tags.filter(tag => !isEmail(tag)))
  }, [tags])

  function handleInput(v) {
    if (/[\s,;]/.test(v)) {
      setInput('')
      setTags(
        Array.from(
          new Set([
            ...tags,
            ...v
              .split(/[\s,;]/)
              .map(v => v.trim())
              .filter(Boolean),
          ])
        )
      )
    } else setInput(v)
  }

  function removeTag(v) {
    setTags(tags.filter(tag => tag !== v))
  }

  function inputValid() {
    if (tags.length === 0 && !input) return false
    if (invalid.length > 0) return false
    if (input.length && !isEmail(input)) return false
    return true
  }

  return (
    <S.Invite>
      <Title s2>Invite People to join Upframe</Title>
      <Text>
        Know any like-minded people who would be thrilled to be here? Invite them so they can create an account.
      </Text>
      <Labeled
        label="Invite People"
        action={
          <Tagarea
            input={input}
            onChange={handleInput}
            tags={tags}
            onTagClick={removeTag}
          />
        }
      />
      {invalid.length > 0 && (
        <S.Invalid>{`${invalid.map(v => `"${v}"`).join(', ')} ${
          invalid.length > 1
            ? 'are not valid email addresses'
            : 'is not a valid email address'
        }.`}</S.Invalid>
      )}
      <S.Actions>
        {me?.role !== 'USER' && (
          <>
            <label htmlFor="role">Invite as</label>
            <select
              id="role"
              value={role}
              onChange={({ target }) => setRole(target.value)}
            >
              <option value="USER" name="role">
                Founder
              </option>
              <option value="MENTOR">Mentor</option>
            </select>
          </>
        )}
        <Button filled disabled={!inputValid()} onClick={invite}>
          Send invitations
        </Button>
      </S.Actions>
      {invites.length > 0 && (
        <>
          <Title s2>Sent Invitations</Title>
          <S.List>
            <b>email</b>
            <b>role</b>
            <b>status</b>
            {invites.flatMap(({ email, role, status }) => [
              <span key={`${email}-email`}>{email}</span>,
              <span key={`${email}-role`}>{role}</span>,
              <span key={`${email}-status`}>{status}</span>,
            ])}
          </S.List>
        </>
      )}
    </S.Invite>
  )
}

const S = {
  Invite: styled.div`
    & > h2:first-child {
      margin-top: 0;
    }

    ${Tagarea.Wrap} {
      width: 100%;
    }

    & > p:first-child {
      margin: 2rem 0;
    }
  `,

  Invalid: styled.p`
    color: var(--cl-error);
    margin: 0.5rem 0;
  `,

  Actions: styled.div`
    display: flex;
    margin-top: 2rem;
    margin-bottom: 5rem;
    align-items: center;

    & > * {
      margin-top: 0;
      margin-bottom: 0;
    }

    select {
      margin-left: 1rem;
    }

    *:last-child {
      margin-right: 0;
      margin-left: auto;
    }
  `,

  List: styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-gap: 1.5rem;
    margin-top: 2rem;
    text-transform: lowercase;
  `,
}
