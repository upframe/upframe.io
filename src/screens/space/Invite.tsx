import React, { useState } from 'react'
import styled from 'styled-components'
import roles, { Role } from './roles'
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

export function InviteMenu({ onClose, role, name }: Props) {
  const [tab, setTab] = useState(tabs[0])

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
            <Tagarea />
            <Button accent>Send invites</Button>
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

    div {
      display: flex;
      flex-direction: column;

      button {
        margin-top: 1.5rem;
        align-self: flex-end;
      }
    }
  `,
}
