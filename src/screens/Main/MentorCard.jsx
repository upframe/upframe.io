import React from 'react'
import { Card, ProfilePicture, Title, Chip } from '../../components'
import styles from './mentorcard.module.scss'

export default function MentorCard({ mentor }) {
  let tags =
    mentor && mentor.tags ? JSON.parse(mentor.tags).map(({ text }) => text) : []
  if (tags.length > 2) tags = [...tags.slice(0, 2), '+']

  return (
    <Card className={styles.mentorCard} linkTo={mentor.keycode}>
      <ProfilePicture
        imgs={
          Object.entries(mentor.pictures || {}).length
            ? mentor.pictures
            : mentor.profilePic
        }
        size="13rem"
      />
      <div className={styles.info}>
        <Title s3>{mentor.name}</Title>{' '}
        <p className={styles.role}>
          {mentor.role}
          {mentor.company ? ` at ${mentor.company}` : ''}
        </p>
        <p className={styles.bio}>{mentor.bio}</p>
        <div className={styles.skills}>
          {tags.map(v => (
            <Chip key={v} removable={false}>
              {v}
            </Chip>
          ))}
        </div>
      </div>
    </Card>
  )
}
