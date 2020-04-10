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
import { notify } from '../../notification'
import { useCtx } from '../../utils/hooks'

export default function Request({ mentor, onClose, slot }) {
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [valid, setValid] = useState(true)
  const { currentUser } = useCtx()

  const [sendMessage] = useMutation(mutations.SEND_MESSAGE_EXT, {
    variables: { msg, to: mentor.id, ...(!currentUser && { email, name }) },
    onCompleted() {
      onClose()
    },
  })

  const [requestSlot] = useMutation(mutations.REQUEST_MEETUP, {
    variables: { msg, email, name, slotId: slot },
    onCompleted() {
      notify('Meetup was requested. Now wait for the mentor to confirm.')
      onClose()
    },
  })

  useEffect(() => {
    setValid(msg.length && (currentUser || (isEmail(email) && name.length)))
  }, [email, msg, name, currentUser])

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
        {!currentUser && (
          <>
            <Labeled
              label="Your name"
              action={<Input value={name} onChange={setName} />}
            />
            <Labeled
              label="Your email"
              action={<Input value={email} onChange={setEmail} />}
            />
          </>
        )}

        <Button disabled={!valid} filled onClick={submit}>
          Send
        </Button>
      </div>
    </Shade>
  )
}
