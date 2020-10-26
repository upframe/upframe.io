import React, { useState, useEffect } from 'react'
import { mutations, useMutation } from 'gql'
import { Title, Textbox, Button, Icon } from '../../components/'
import { notify } from 'notification'
import { useMe } from 'utils/hooks'
import { ordNum } from '../../utils/date'
import styled from 'styled-components'

const WEEK_DAYS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const formatAMPM = date => {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  const strTime = hours + ':' + minutes + ampm
  return strTime
}

const getTimeStringFromDatetimeString = date => {
  const d = new Date(date)
  return `${WEEK_DAYS[d.getMonth()]} ${ordNum(d.getDate())} at ${formatAMPM(d)}`
}

const IconWithLabel = ({ icon, label, underline = false }) => (
  <Styles.IconLabel underline={underline}>
    <Icon icon={icon} />
    <span>{label}</span>
  </Styles.IconLabel>
)

export default function Request({ slot }) {
  const [msg, setMsg] = useState('')
  const [valid, setValid] = useState(true)
  const { me } = useMe()

  const [requestSlot] = useMutation(mutations.REQUEST_MEETUP, {
    variables: { msg, slotId: slot },
    onCompleted() {
      notify('Meetup was requested. Now wait for the mentor to confirm.')
    },
  })

  useEffect(() => {
    setValid(msg.length && me)
  }, [msg, me])

  async function submit() {
    requestSlot()
  }

  return (
    <Styles.SchedulingContainer>
      <Styles.MessageBoxContainer>
        <Title size={4}>Message</Title>
        <Textbox
          placeholder="I have challenge x and was hoping you could help me with y."
          values={msg}
          onChange={setMsg}
        />
        <Styles.Hint>
          We’ll send an invittion to Tocha. You’ll receive a confirmation for
          your meeting in your inbox.
        </Styles.Hint>
      </Styles.MessageBoxContainer>
      <Styles.MeetingTimeContainer>
        <Title size={3}>Your Meeting</Title>
        <IconWithLabel
          label={getTimeStringFromDatetimeString(slot.start)}
          icon="calendar"
          underline={true}
        />
        <IconWithLabel label={'Duration: 30 min'} icon="clock" />
        <Button disabled={!valid} filled onClick={submit}>
          Send Invite
        </Button>
      </Styles.MeetingTimeContainer>
    </Styles.SchedulingContainer>
  )
}

const Styles = {
  SchedulingContainer: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > :first-child {
      margin-right: 12px;
    }

    @media (max-width: 1330px), (orientation: portrait) {
      flex-direction: column;

      & > :last-child {
        margin-top: 18px;
      }
    }
  `,
  MessageBoxContainer: styled.div`
    display: flex;
    flex-direction: column;

    & > :first-child {
      margin: 0;
    }
  `,
  MeetingTimeContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    & > :last-child {
      margin-top: 30px;
    }

    & > :first-child {
      margin-bottom: 30px;
    }
  `,
  IconLabel: styled.div`
    display: flex;
    flex-direction: row;
    color: rgba(0, 0, 0, 0.6);
    justify-content: space-between;

    & > svg {
      margin-right: 12px;
    }

    ${({ underline }) =>
      underline &&
      `
      & > span {
        text-decoration: underline;
      }
    `}
  `,
  Hint: styled.div`
    color: rgba(0, 0, 0, 0.4);
    font-size: 0.8em;
    margin-top: 6px;
  `,
}
