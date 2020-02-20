import React, { useState, useEffect } from 'react'
import styles from './request.module.scss'
import { isEmail } from '../../utils/validate'
import { mutations, useMutation } from '../../gql'
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

export default function Request({ mentor, onClose, slot }) {
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [valid, setValid] = useState(true)

  const [sendMessage] = useMutation(mutations.SEND_MESSAGE_EXT, {
    variables: { msg, email, name, to: mentor.id },
    onCompleted() {
      onClose()
    },
  })

  const [requestSlot] = useMutation(mutations.REQUEST_MEETUP, {
    variables: { msg, email, name, slotId: slot },
    onCompleted() {
      onClose()
    },
  })

  useEffect(() => {
    setValid(isEmail(email) && msg.length && name.length)
  }, [email, msg, name])

  async function submit() {
    if (slot) requestSlot()
    else sendMessage()
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
