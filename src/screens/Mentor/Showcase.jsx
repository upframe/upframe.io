import React from 'react'
import styles from './profile.module.scss'
import {
  Card,
  ProfilePicture,
  Icon,
  SocialIcon,
  Title,
  Text,
  Chip,
} from '../../components'

export default function Showcase({ mentor }) {
  return (
    <Card className={styles.showcase}>
      <div className={styles.leftColumn}>
        <ProfilePicture imgs={mentor.profilePictures} size="13rem" />
        <p className={styles.name}>{mentor.name}</p>
        <p className={styles.role}>
          {mentor.title}
          {mentor.company ? ` at ${mentor.company}` : ''}
        </p>
        <p className={styles.location}>
          <Icon icon="location" />
          {mentor.location}
        </p>
        <div className={styles.social}>
          {(mentor.social || []).map(({ name, url, handle }) => (
            <SocialIcon
              key={name}
              link={url + handle}
              {...{ [name.toLowerCase()]: true }}
            />
          ))}
        </div>
      </div>
      <div className={styles.rightColumn}>
        <Title s3>About me</Title>
        {mentor.biography &&
          mentor.biography
            .split('\n')
            .map((v, i) => <Text key={`biography${i}`}>{v}</Text>)}
        {Array.isArray(mentor.tags) && (
          <>
            <Title s3>I can advise you on</Title>
            <div className={styles.skills}>
              {mentor.tags.map(v => (
                <Chip key={v} removable={false}>
                  {v}
                </Chip>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
