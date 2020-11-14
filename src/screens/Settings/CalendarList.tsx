import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Title, Text, Checkbox, Button } from 'components'
import GcalConnect from './GcalConnect'
import GcalSelect from './GcalSelect'
import layout from 'styles/layout'
import type { SettingsCalendar_user_Mentor } from 'gql/types'

interface Props {
  user: SettingsCalendar_user_Mentor
  loading: string[]
  onChange(v: string[]): void
  connecting?: boolean
}

export default function CalendarList({ onChange, user, loading = [] }: Props) {
  const [selection, setSelection] = useState<string[]>([])
  const [selectGcal, setSelectGcal] = useState(false)

  useEffect(() => {
    const saved: string[] = JSON.parse(
      localStorage.getItem('calendars') ?? '[]'
    )
    if (saved.length) {
      setSelection(saved)
      onChange(saved)
    }
  }, [onChange])

  function toggleCalendar(id, v) {
    if (v === undefined) v = !selection.includes(id)
    const select = v ? [...selection, id] : selection.filter(n => n !== id)
    localStorage.setItem('calendars', JSON.stringify(select))
    setSelection(select)
    onChange(select)
  }

  return (
    <S.Wrap>
      <S.Container
        data-status={user.google?.gcalGranted ? 'connected' : 'disconnected'}
      >
        {!user.google?.gcalGranted || !user.google?.gcalConnected ? (
          <>
            <Title size={3}>Connect your Google&nbsp;Calendar</Title>
            {!user.google?.gcalGranted ? (
              <>
                <Text strong small mark>
                  Scheduled events are added instantly to your calendar.
                </Text>
                <Text strong small>
                  Check your availability before adding free slots.
                </Text>
                <GcalConnect />
              </>
            ) : (
              <>
                <Text strong small mark>
                  Select a Google Calendar to finish the setup.
                </Text>
                <Text strong small>
                  We will add your Upframe slots to the calendar you select.
                </Text>
                <Button accent onClick={() => setSelectGcal(true)}>
                  Select Calendar
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Title size={3}>Calendars</Title>
            <S.List>
              {(user.google.calendars ?? []).map(({ id, name, color }) => {
                return (
                  <S.Toggle key={id}>
                    <Checkbox
                      onChange={v => toggleCalendar(id, v)}
                      checked={selection.includes(id)}
                      color={color ?? undefined}
                      loading={loading.includes(id)}
                    />
                    <Text small strong>
                      {name}
                    </Text>
                  </S.Toggle>
                )
              })}
            </S.List>
          </>
        )}
      </S.Container>
      {selectGcal && (
        <GcalSelect onClose={() => setSelectGcal(false)} user={user} />
      )}
    </S.Wrap>
  )
}

/* prettier-ignore */
const S = {
  Wrap: styled.div`
    box-sizing: border-box;
    top: 0;
    left: 0;
    width: ${layout.settings.nav.minWidth};
    margin-left: calc((${layout.settings.leftColumn.width} - ${layout.settings.nav.minWidth}) / 2);
    position: absolute;
    height: calc(7rem + ${layout.settings.calendar.height});
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  `,

  Container: styled.div`
    display: block;
    box-sizing: border-box;
    width: calc(100% - 2px);
    border-radius: var(--border-radius);
    position: sticky;
    top: 50vh;
    padding: 1.5rem 1rem;
    padding-bottom: 0;
    background-color: var(--cl-background);
    z-index: 1000;

    h3 {
      text-align: center;
      margin-top: 0;
    }

    & > *:not(button):not(:last-child) {
      color: black;
      margin: 0;
      margin-bottom: 1.2rem;
    }

    button {
      width: 100%;
      margin-top: 2rem;
    }

    &[data-status='connected'] {
      border: none;
      overflow-x: hidden;

      & > * {
        text-align: left;
      }
    }
  `,

  List: styled.div`
    display: block;
    height: 15rem;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: none;
  `,

  Toggle: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;

    * {
      margin-top: 0;
      margin-bottom: 0;
    }

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    input,
    svg {
      margin: 0;
      margin-right: 1rem;
      cursor: pointer;
      flex-shrink: 0;
    }

    svg {
      margin-right: calc(var(--off) + 1rem);
    }
  `,
}
