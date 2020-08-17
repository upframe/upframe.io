import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ProfilePicture, Link } from 'components'
import type { Participant } from 'gql/types'

export default function Participants({
  user,
}: {
  user: Exclude<Participant['user'], null>
}) {
  const utcOffset = user.timezone?.utcOffset
  const time = useLocalTime(utcOffset)

  return (
    <S.Participant>
      <ProfilePicture
        imgs={user.profilePictures}
        size={picSize}
        linkTo={`/${user.handle}`}
      />
      <S.Info>
        <S.Name>{user.name}</S.Name>
        <S.Secondary>
          <S.Profile to={`/${user.handle}`}>View Profile</S.Profile> |{' '}
          <S.Time title={user.timezone?.informal?.current?.name ?? ''}>
            {typeof utcOffset === 'number' ? 'Local Time ' : ''}
            {time}
          </S.Time>
        </S.Secondary>
      </S.Info>
    </S.Participant>
  )
}

function useLocalTime(utcOffset = -new Date().getTimezoneOffset()) {
  const [time, setTime] = useState('')

  useEffect(() => {
    let tId: number

    function update() {
      let date = new Date()
      if (utcOffset) {
        const dUTC = date.getTimezoneOffset() - -utcOffset
        date = new Date(date.getTime() + 1000 * 60 * dUTC)
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

      tId = setTimeout(update, (60 - new Date().getSeconds()) * 1000 + 100)
    }
    update()

    return () => clearTimeout(tId)
  }, [utcOffset])

  return time
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
