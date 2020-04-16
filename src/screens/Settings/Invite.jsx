import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Title, Labeled, Tagarea, Text, Button } from '../../components'
import { isEmail } from '../../utils/validate'
import { useMe } from '../../utils/hooks'

export default function Invite() {
  const [input, setInput] = useState('')
  const [tags, setTags] = useState([])
  const [invalid, setInvalid] = useState([])
  const { me } = useMe()

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
      <Title s2>Invite</Title>
      <Text>
        Invite new users to Upframe by writing their email here. You can also
        paste multiple emails at once if they are separated by a space, comma,
        semicolon or newline.
      </Text>
      <Labeled
        label="Emails"
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
        {me && me.role !== 'USER' && (
          <>
            <label htmlFor="role">Invite as</label>
            <select id="role">
              <option value="user" name="role">
                User
              </option>
              <option value="mentor">Mentor</option>
            </select>
          </>
        )}
        <Button filled disabled={!inputValid()}>
          Send invitations
        </Button>
      </S.Actions>
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
}
