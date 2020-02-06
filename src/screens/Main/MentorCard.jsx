import React from 'react'
import { Card, ProfilePicture, Title, Chip } from '../../components'
import styles from './mentorcard.module.scss'

export default function MentorCard({ mentor }) {
  let tags =
    mentor && mentor.tags ? JSON.parse(mentor.tags).map(({ text }) => text) : []
  if (tags.length > 2) tags = [...tags.slice(0, 2), '+']

  const imgSize = window.innerWidth > 720 ? '13rem' : '18rem'

  return (
    <Card
      className={styles.mentorCard}
      linkTo={mentor.keycode}
      data-aos="fade-up"
      data-aos-offset="0"
      data-aos-delay="300"
    >
      <ProfilePicture
        imgs={
          Object.entries(mentor.pictures || {}).length
            ? mentor.pictures
            : mentor.profilePic
        }
        size={imgSize}
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
