import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Radio, Button } from 'components'
import { gql, fragments, useMutation } from 'gql'
import type * as T from 'gql/types'

const SET_GCAL = gql`
  mutation SetGoogleCalendar($calendar: ID) {
    setGCal(calendar: $calendar) {
      ...CalendarSettings
    }
  }
  ${fragments.person.settingsCalendar}
`

interface Props {
  onClose(): void
  user: T.SettingsCalendar_user_Mentor
}

export default function GcalSelect({ onClose, user }: Props) {
  const [selected, setSelected] = useState('new')

  const [select] = useMutation<
    T.SetGoogleCalendar,
    T.SetGoogleCalendarVariables
  >(SET_GCAL)

  async function submit() {
    await select({
      variables: { calendar: selected === 'new' ? undefined : selected },
    })
    onClose()
  }

  const calendars = user.google?.calendars?.filter(
    ({ access }) => access === 'owner'
  )
  if (!calendars) return null
  return (
    <Modal title="Select Calendar" onClose={onClose}>
      <S.Select>
        <Radio
          options={[
            { label: 'Create new calendar', id: 'new' },
            ...calendars.map(({ name: label, ...rest }) => ({
              label,
              ...rest,
            })),
          ]}
          selected={selected}
          onSelect={setSelected}
        />
      </S.Select>
      <S.BtWrap onClick={submit}>
        <Button accent>{selected === 'new' ? 'Create' : 'Select'}</Button>
      </S.BtWrap>
    </Modal>
  )
}

const S = {
  Select: styled.div`
    max-height: 50vh;
    overflow-y: auto;
  `,

  BtWrap: styled.div`
    width: 100%;
    margin-top: 2rem;
    display: flex;
    justify-content: space-around;
  `,
}
