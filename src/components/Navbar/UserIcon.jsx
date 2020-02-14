import React from 'react'
import { ProfilePicture } from 'components'
import styles from './userIcon.module.scss'

export default function UserIcon({ user, onClick }) {
  return (
    <div className={styles.userIcon} onClick={onClick}>
      <ProfilePicture size="2.625rem" imgs={user.profilePictures} />
    </div>
  )
}
