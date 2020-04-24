import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Text, Title, Checkbox, Button, GoogleSignin, Modal } from 'components'
import ConfirmDelete from './ConfirmDelete'
import styles from './account.module.scss'
import { useMe } from '../../utils/hooks'
import { gql, mutations, useQuery, useMutation } from '../../gql'
import { classes } from '../../utils/css'
import { hasError } from '../../api'
import { notify } from '../../notification'

const GOOGLE_CONNECTED = gql`
  query GoogleConnected($id: ID!) {
    user(id: $id) {
      id
      google {
        connected
        email
        canDisconnect
      }
    }
  }
`

export default function Account() {
  const history = useHistory()
  const { me = {} } = useMe()
  const [deleteRequested, setDeleteRequested] = useState(false)
  const [disconnectRequested, setDisconnectRequested] = useState(false)
  const { data: { user: { google = {} } = {} } = {} } = useQuery(
    GOOGLE_CONNECTED,
    {
      variables: { id: me.id },
      skip: !me.id,
    }
  )

  const [setVisibility, { loading }] = useMutation(
    mutations.SET_PROFILE_VISIBILITY
  )
  const [disconnectGoogle] = useMutation(mutations.DISCONNECT_GOOGLE, {
    onCompleted() {
      setDisconnectRequested(false)
    },
  })
  const [connectGoogle] = useMutation(mutations.CONNECT_GOOGLE, {
    onError(err) {
      if (hasError(err, 'INVALID_GRANT'))
        notify('Invalid grant. Try connecting Google again.')
      history.push(window.location.pathname)
    },
    onCompleted() {
      history.push(window.location.pathname)
    },
  })

  const code = new URLSearchParams(window.location.search).get('code')
  useEffect(() => {
    if (!code || !connectGoogle) return
    connectGoogle({
      variables: {
        code,
        redirect: window.location.origin + window.location.pathname,
      },
    })
  }, [code, connectGoogle])

  return (
    <div className={styles.account}>
      <Title s2 className={styles.span2}>
        Account
      </Title>
      <Text className={styles.span2}>
        Spend less time here and focus on what really matters by syncing your
        calendar with Upframe.
      </Text>

      <Title s4 className={styles.span2}>
        Your email
      </Title>
      <Text>
        <Text underlined>{me.email}</Text> is your current email address
        connected to your Upframe account.
      </Text>
      <Button linkTo="/reset/email">Change Email</Button>

      <Title s4 className={styles.span2}>
        Password
      </Title>
      <Text>
        {!google.connected || google.canDisconnect
          ? 'Set a new password for your account.'
          : 'Set a password so you can sign in using your email.'}
      </Text>
      <Button linkTo="/reset/password">
        {!google.connected || google.canDisconnect ? 'Change' : 'Set'} password
      </Button>

      <Title s2 className={styles.span2}>
        Connections
      </Title>
      <Title s4 className={styles.span2}>
        Connect to Google
      </Title>
      <Text>
        {google.connected
          ? 'You can sign into Upframe using your Google Account.'
          : 'You will be able to use your Google Account to sign into Upframe.'}
      </Text>
      {google.connected ? (
        <div className={styles.disconnectGoogle}>
          <Text bold>{google.email}</Text>
          <Button text onClick={() => setDisconnectRequested(true)}>
            disconnect
          </Button>
        </div>
      ) : (
        <GoogleSignin text="Connect to Google" />
      )}

      <Title s2 className={styles.span2}>
        Your Data
      </Title>
      <Text className={styles.span2}>
        At Upframe, we care about your privacy and are actively working in order
        to give you back control and ownership of your data. Just like how it
        should be.
      </Text>

      <Title s4 className={styles.span2}>
        Delete Account
      </Title>
      <Text>
        Your account will be removed from our database. Your username and public
        profile will no longer be available at upframe.io. This action is
        irreversible, please proceed with caution.
      </Text>
      <Button onClick={() => setDeleteRequested(true)}>Delete Account</Button>
      {me.role && me.role !== 'USER' && (
        <>
          <Title s2 className={styles.span2}>
            Privacy
          </Title>
          <div className={classes(styles.privacyCheck, styles.span2)}>
            <Checkbox
              checked={me.visibility === 'UNLISTED'}
              onChange={v =>
                setVisibility({
                  variables: { visibility: v ? 'UNLISTED' : 'LISTED' },
                })
              }
              loading={loading}
            />
            <Text>Hide my profile from the homepage.</Text>
          </div>
        </>
      )}
      {deleteRequested && (
        <ConfirmDelete onCancel={() => setDeleteRequested(false)} />
      )}
      {disconnectRequested && (
        <Modal
          title="Disconnect Google"
          {...(google.canDisconnect
            ? {
                text:
                  "Are you sure? You won't be able to sign in using your Google account anymore.",
                actions: [
                  <Button
                    key="disc_cancel"
                    onClick={() => setDisconnectRequested(false)}
                  >
                    Cancel
                  </Button>,
                  <Button key="disc_disc" warn onClick={disconnectGoogle}>
                    Disconnect
                  </Button>,
                ],
              }
            : {
                text:
                  "You can't disconnect your Google account because currently it is your only method to sign into Upframe. Please first set a password so you won't be locked out of your account.",
              })}
          onClose={() => setDisconnectRequested(false)}
        ></Modal>
      )}
    </div>
  )
}
