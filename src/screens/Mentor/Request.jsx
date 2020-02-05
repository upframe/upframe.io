import React, { useState } from 'react'
import styles from './request.module.scss'
import Api from '../../utils/Api'
import {
  Shade,
  Title,
  Labeled,
  Input,
  Textbox,
  Button,
  Divider,
  Icon,
} from '../../components/'

const tz = new Date().getTimezoneOffset()

export default function Request({ mentor, onClose, slot }) {
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [valid, setValid] = useState(true)

  async function submit() {
    const { ok } = await (slot
      ? Api.createMeetup(
          slot,
          `https://talky.io/${mentor.name.replace(/ /g, '').toLowerCase()}`,
          msg,
          email,
          name,
          tz
        )
      : Api.requestTimeSlot(mentor.keycode, email, name, msg, tz))

    alert(
      ok !== 1
        ? 'Something failed! Contact our dev team!'
        : slot
        ? 'Time slots requested. Now wait for mentor confirmation.'
        : 'Meetup created! Now wait for mentor confirmation'
    )
    onClose()
  }

  return (
    <Shade onClick={onClose}>
      <div className={styles.request} onClick={e => e.stopPropagation()}>
        <Icon icon="close" onClick={onClose} />
        <Title s1>
          {slot ? 'Have a call with' : 'Message'} {mentor.name.split(' ')[0]}
        </Title>
        <Divider />
        <Labeled
          label="Message"
          action={
            <Textbox
              placeholder="I have challenge x and was hoping you could help me with y."
              values={msg}
              onChange={setMsg}
            />
          }
        />
        <Labeled
          label="Your name"
          action={<Input value={name} onChange={setName} />}
        />
        <Labeled
          label="Your email"
          action={<Input value={email} onChange={setEmail} />}
        />
        <Button disabled={!valid} filled onClick={submit}>
          Send
        </Button>
      </div>
    </Shade>
  )
}
