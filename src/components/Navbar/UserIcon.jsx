import React from 'react'
import { ProfilePicture } from 'components'
import styles from './userIcon.module.scss'
import { gql, useQuery, fragments } from 'gql'

const IMG_QUERY = gql`
  query ProfilePicture($userId: ID) {
    user(id: $userId) {
      id
      ...ProfilePictures
    }
  }
  ${fragments.person.profilePictures}
`

export default function UserIcon({ userId, onClick }) {
  const { data: { user = {} } = {} } = useQuery(IMG_QUERY, {
    variables: { userId },
  })

  return (
    <div className={styles.userIcon} onClick={onClick}>
      <ProfilePicture size="2.625rem" imgs={user.profilePictures} />
    </div>
  )
}
