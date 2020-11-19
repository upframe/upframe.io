import React from 'react'
import styled from 'styled-components'
import styles from './profile.module.scss'
import {
  Card,
  ProfilePicture,
  Icon,
  SocialIcon,
  Title,
  Text,
  Chip,
  Button,
} from '../../components'
import { useMe } from 'utils/hooks'

export default function Showcase({ user, conId }) {
  const { me } = useMe()

  return (
    <Card className={styles.showcase}>
      <div className={styles.leftColumn}>
        <ProfilePicture imgs={user.profilePictures} size="13rem" />
        <p className={styles.name}>{user.name}</p>
        <p className={styles.role}>{user.headline}</p>
        {user.location && (
          <p className={styles.location}>
            <Icon icon="location" />
            {user.location}
          </p>
        )}
        <div className={styles.social}>
          {(user.social || []).map(({ name, url, handle }) => (
            <SocialIcon
              key={name}
              link={url + handle}
              {...{ [name.toLowerCase()]: true }}
            />
          ))}
        </div>
        {me && (
          <ButtonContainer>
            <Button
              filled
              linkTo={
                conId
                  ? `/conversations/${conId}`
                  : user.id !== me.id
                  ? `/conversations/new?parts=${user.id}`
                  : '/conversations'
              }
            >
              Message
            </Button>
          </ButtonContainer>
        )}
      </div>
      <div className={styles.rightColumn}>
        <Title size={3}>About me</Title>
        {user.biography &&
          user.biography
            .split('\n')
            .map((v, i) => <Text key={`biography${i}`}>{v}</Text>)}
        {user.role !== 'USER' && Array.isArray(user.tags) && (
          <>
            <Title size={3}>I can advise you on</Title>
            <div className={styles.skills}>
              {user.tags.map(({ id, name }) => (
                <Chip key={id} removable={false}>
                  {name}
                </Chip>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

const ButtonContainer = styled.span`
  margin-top: 1rem;
`
