import React, { useState, useEffect } from 'react'
import styles from './request.module.scss'
import { mutations, useMutation } from 'gql'
import {
  Shade,
  Title,
  Labeled,
  Textbox,
  Button,
  Divider,
  Icon,
} from '../../components/'
import { notify } from 'notification'
import { useMe } from 'utils/hooks'

export default function Request({ mentor, onClose, slot }) {
  const [msg, setMsg] = useState('')
  const [valid, setValid] = useState(true)
  const { me } = useMe()

  const [requestSlot] = useMutation(mutations.REQUEST_MEETUP, {
    variables: { msg, slotId: slot },
    onCompleted() {
      notify('Meetup was requested. Now wait for the mentor to confirm.')
      onClose()
    },
  })

  useEffect(() => {
    setValid(msg.length && me)
  }, [msg, me])

  async function submit() {
    requestSlot()
  }

  return (
    <Shade onClick={onClose}>
      <div className={styles.request} onClick={e => e.stopPropagation()}>
        <Icon icon="close" onClick={onClose} />
        <Title size={1}>Have a call with {mentor.displayName}</Title>
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
        <Button disabled={!valid} filled onClick={submit}>
          Send
        </Button>
      </div>
    </Shade>
  )
}
