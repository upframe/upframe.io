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
          {mentor.role}
          {mentor.company ? ` at ${mentor.company}` : ''}
        </p>
        <p className={styles.location}>
          <Icon icon="location" />
          {mentor.location}
        </p>
        <div className={styles.social}>
          {['facebook', 'twitter', 'linkedin', 'github', 'dribbble'].map(v => (
            <SocialIcon {...{ [v]: true }} link={mentor.social[v]} key={v} />
          ))}
        </div>
      </div>
      <div className={styles.rightColumn}>
        <Title s3>About me</Title>
        {mentor.bio &&
          mentor.bio
            .split('\n')
            .map((v, i) => <Text key={`bio${i}`}>{v}</Text>)}
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
