import React, { useState } from 'react'
import styled from 'styled-components'
import Participant from './Participant'
import { useParticipants } from 'conversations/hooks'
import { Icon, ProfilePicture } from 'components'
import { useHistory } from 'react-router-dom'
import { desktop } from 'styles/responsive'

export default function Participants({ ids = [] }: { ids?: string[] }) {
  const history = useHistory()
  const users = useParticipants(ids)
  const [active, setActive] = useState<typeof users[number]>()

  const goBack = () => {
    if (
      document.referrer &&
      new URL(document.referrer).host === window.location.host
    )
      return history.goBack()
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'preview') {
      params.delete('mode')
      let qStr = params.toString()
      if (qStr) qStr = '?' + qStr
      history.replace(window.location.pathname + qStr)
    } else history.replace('/conversations')
  }

  return (
    <S.Participants>
      <S.Back onClick={goBack}>
        <Icon icon="arrow_back" />
      </S.Back>
      {users.length === 1 ? (
        <Participant user={users[0]} />
      ) : (
        <>
          <S.PhotoStack onMouseLeave={() => setActive(undefined)}>
            {users.map(user => (
              <S.PhotoWrap
                key={`photo-${user.id}`}
                onMouseEnter={() => setActive(user)}
              >
                <ProfilePicture
                  imgs={user.profilePictures}
                  size={picSize}
                  linkTo={`/${user.handle}`}
                />
              </S.PhotoWrap>
            ))}
          </S.PhotoStack>
          <S.MultiInfo>
            {active ? (
              <Participant user={active} />
            ) : (
              <span>
                {users.map(({ displayName }) => displayName).join(', ')}
              </span>
            )}
          </S.MultiInfo>
        </>
      )}
    </S.Participants>
  )
}

const picSize = '2.5rem'

const S = {
  Participants: styled.div`
    width: 100%;
    height: 4rem;
    border-bottom: 1.5px solid #e5e5e5;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 1rem;
    flex-shrink: 0;
  `,

  Back: styled.div`
    margin-right: 0.75rem;
    margin-left: -0.5rem;
    height: 100%;
    display: inline-block;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    @media ${desktop} {
      display: none;
    }
  `,

  PhotoStack: styled.div`
    display: flex;

    &:hover div:not(:hover) img {
      filter: brightness(0.7);
    }
  `,

  PhotoWrap: styled.div`
    width: calc(${picSize} + 4px);
    height: calc(${picSize} + 4px);
    transition: transform 0.15s ease;
    z-index: 1;
    padding: 2px;
    position: relative;

    &:not(:first-of-type) {
      margin-left: calc(-${picSize} + 0.75rem);
    }

    &:hover {
      z-index: 5;
    }

    &:hover ~ & {
      transform: translateX(calc((${picSize} + 0.75rem) / 2 + 0.2rem));
    }

    &:last-of-type {
      transition: transform 0.15s ease, margin-right 0.15s ease;

      &:hover {
        margin-right: calc(((${picSize} + 0.75rem) / 2 + 0.2rem) * -1);
      }
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-shadow: 0 0 5px #0003;
      transition: filter 0.15s ease;
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      left: 0;
      top: 0;
      border-radius: 50%;
      backdrop-filter: blur(0.25rem);
    }
  `,

  MultiInfo: styled.div`
    margin-left: 1rem;
    transition: transform 0.15s ease;

    & > span {
      font-weight: bold;
      font-size: 1rem;
      color: var(--cl-text-strong);
    }

    div:hover + & {
      transform: translateX(calc((${picSize} + 0.75rem) / 2 + 0.2rem));
    }

    picture {
      display: none;
    }

    & > div > div {
      margin-left: 0;
    }
  `,
}
