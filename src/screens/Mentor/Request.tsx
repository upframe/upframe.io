import React, { useState, useEffect } from 'react'
import { mutations, useMutation } from 'gql'
import { Modal, Labeled, Textbox, Button } from '../../components/'
import { notify } from 'notification'
import { useMe, useHistory } from 'utils/hooks'

export default function Request({ mentor, onClose, slot }) {
  const [msg, setMsg] = useState('')
  const [valid, setValid] = useState(true)
  const { me } = useMe()
  const history = useHistory()

  const [requestSlot] = useMutation(mutations.REQUEST_MEETUP, {
    variables: { msg, slotId: slot },
    onCompleted({ requestSlot: path }) {
      notify('Meetup was requested. Now wait for the mentor to confirm.')
      onClose()
      if (!path) return
      history.push(`/conversations/${path}`)
    },
  })

  useEffect(() => {
    setValid(!!(msg.length && me))
  }, [msg, me])

  return (
    <Modal
      title={`Have a call with ${mentor.displayName}`}
      actions={
        <Button disabled={!valid} filled onClick={() => requestSlot()}>
          Send
        </Button>
      }
      onClose={onClose}
      cancellable={!msg.length}
    >
      <Labeled
        label="Message"
        action={
          <Textbox
            placeholder="I have challenge x and was hoping you could help me with y."
            value={msg}
            onChange={setMsg}
          />
        }
      />
    </Modal>
  )
}
