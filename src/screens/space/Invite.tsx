import React, { useState } from 'react'
import styled from 'styled-components'
import roles, { Role } from './roles'
import { isEmail } from 'utils/validate'
import {
  Button,
  Modal,
  Title,
  Text,
  Dropdown,
  Navbar,
  Tagarea,
} from 'components'

interface Props {
  onClose(): void
  name: string
  role: Role
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

export function InviteMenu({ onClose, role, name }: Props) {
  const [tab, setTab] = useState(tabs[0])
  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [invalid, setInvalid] = useState<string[]>([])

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

  function sendEmailInvites() {
    console.log('invite', emails)
  }

  return (
    <Modal onClose={onClose} title={`Invite ${role} to ${name}`}>
      <S.Invite>
        <Navbar tabs={tabs} active={tab} onNavigate={setTab} />
        {tab === tabs[0] && (
          <div>
            <Text>
              You can also paste multiple emails at once if they are seperated
              by a space, comma, semicolon or newline.
            </Text>
            <Tagarea
              input={emailInput}
              onChange={handleEmailInput}
              tags={emails}
              onTagClick={removeEmail}
            />
            {invalid.length > 0 && <S.Error>{formatInvalid(invalid)}</S.Error>}
            <Button accent onClick={sendEmailInvites} disabled={!inputValid()}>
              Send invites
            </Button>
          </div>
        )}
      </S.Invite>
    </Modal>
  )
}

export function InviteButton({ onSelect }: { onSelect: (v?: Role) => void }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <S.BtWrap>
      <Button
        accent
        filled
        onClick={() => setShowDropdown(true)}
        disabled={showDropdown}
      >
        Invite
      </Button>
      {showDropdown && (
        <Dropdown
          onClick={(v: Role) => {
            setShowDropdown(false)
            onSelect(v)
          }}
          onClose={() => setShowDropdown(false)}
        >
          {Object.entries(roles).map(([k, v]) => (
            <S.Role key={k}>
              <Title size={4}>{k}</Title>
              <Text>{v}</Text>
            </S.Role>
          ))}
        </Dropdown>
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

      button {
        margin-top: 1.5rem;
        align-self: flex-end;
      }
    }
  `,

  Error: styled.span`
    color: var(--cl-error);
  `,
}
