import React from 'react'
import { ProfilePicture } from 'components'
import styles from './userIcon.module.scss'
import { gql, useQuery, fragments } from 'gql'

const IMG_QUERY = gql`
  query ProfilePicture {
    me @client {
      id
      ...ProfilePictures
    }
  }
  ${fragments.person.profilePictures}
`

export default function UserIcon({ onClick }) {
  const { data: { me = {} } = {} } = useQuery(IMG_QUERY, {})

  return (
    <div className={styles.userIcon} onClick={onClick}>
      <ProfilePicture size="2.625rem" imgs={me.profilePictures} />
    </div>
  )
}
