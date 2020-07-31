import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ProfilePicture, Link } from 'components'
import type { ChatParticipants } from 'gql/types'

export default function Participants({
  user,
}: {
  user: ChatParticipants['users'][number]
}) {
  const [time, setTime] = useState('')
  const [tzKnown, setTzKnown] = useState(false)

  useEffect(() => {
    let date = new Date()
    if (user.timezone?.utcOffset) {
      const dUTC = date.getTimezoneOffset() - -user.timezone.utcOffset
      date = new Date(date.getTime() + 1000 * 60 * dUTC)
      setTzKnown(true)
    }
    let suffix = 'AM'
    let hour = date.getHours()
    if (hour >= 12) {
      if (hour >= 13) hour -= 12
      suffix = 'PM'
    }
    setTime(
      `${date.toLocaleString('en-US', {
        month: 'long',
      })} ${date.getDate()}, ${hour}:${`0${date.getMinutes()}`.substr(
        -2
      )} ${suffix}`
    )
  }, [user.timezone?.utcOffset])

  return (
    <S.Participant>
      <ProfilePicture imgs={user.profilePictures} size={picSize} />
      <S.Info>
        <S.Name>{user.name}</S.Name>
        <S.Secondary>
          <S.Profile to={`/${user.handle}`}>View Profile</S.Profile> |{' '}
          <S.Time title={user.timezone?.informal?.current?.name ?? ''}>
            {tzKnown ? 'Local Time ' : ''}
            {time}
          </S.Time>
        </S.Secondary>
      </S.Info>
    </S.Participant>
  )
}

const picSize = '2.5rem'

const S = {
  Participant: styled.div`
    display: flex;
    flex-direction: row;

    img {
      width: ${picSize};
      height: ${picSize};
      border-radius: 50%;
    }
  `,

  Info: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 1rem;

    * {
      margin: 0;
      line-height: 1.5;
    }
  `,

  Name: styled.span`
    font-weight: bold;
    font-size: 1rem;
    color: var(--cl-text-strong);
  `,

  Secondary: styled.span`
    font-size: 0.75rem;
    color: var(--cl-text-medium);
  `,

  Profile: styled(Link)`
    font-size: inherit;
    color: inherit !important;

    &:hover {
      text-decoration: underline;
    }
  `,

  Time: styled.abbr`
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline dotted;
    }
  `,
}
