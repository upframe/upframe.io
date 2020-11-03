import React from 'react'
import styled from 'styled-components'
import { gql, useQuery, useMutation, mutations } from 'gql'
import type * as T from 'gql/types'
import { ordNum } from 'utils/date'
import { Button, Icon } from 'components'
import { useMe } from 'utils/hooks'
import { possessive } from 'utils/grammar'

const SLOT_QUERY = gql`
  query ChannelMeetup($channelId: ID!) {
    channel(channelId: $channelId) {
      id
      slot {
        id
        time
        status
        location
        status
        mentor {
          id
          name
        }
        mentee {
          id
          name
        }
      }
    }
  }
`

const formatDate = (date: Date) =>
  `${date.toLocaleDateString('en-US', {
    month: 'long',
  })} ${ordNum(date.getDate())} at ${date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })}`

export default function Slot({ channelId }: { channelId: string }) {
  const { data } = useQuery<T.ChannelMeetup, T.ChannelMeetupVariables>(
    SLOT_QUERY,
    {
      variables: { channelId },
    }
  )
  const slot = data?.channel?.slot
  const { me } = useMe()

  const query = { query: SLOT_QUERY, variables: { channelId } }

  const [accept] = useMutation(mutations.ACCEPT_MEETUP, {
    variables: {
      meetupId: slot?.id,
    },
    update(cache) {
      const data = cache.readQuery<T.ChannelMeetup>(query)
      if (!data?.channel?.slot) return
      data.channel.slot.status = 'CONFIRMED' as any
      cache.writeQuery({ ...query, data })
    },
  })

  const [decline] = useMutation(mutations.CANCEL_MEETING, {
    variables: { meetupId: slot?.id },
    update(cache) {
      const data = cache.readQuery<T.ChannelMeetup>(query)
      if (!data?.channel?.slot) return
      data.channel.slot.status = 'DECLINED' as any
      cache.writeQuery({ ...query, data })
    },
  })

  if (!slot || !me) return null
  const isMentor = slot.mentor.id === me.id
  const status = slot.status

  return (
    <S.Slot>
      <S.Main>
        <div>
          <S.Title>
            Video call with {slot[isMentor ? 'mentee' : 'mentor'].name}
          </S.Title>
          <span>
            <Icon icon="calendar" />
            {formatDate(new Date(slot.time))}
          </span>
          <span>
            <Icon icon="clock" />
            Duration: 30 min
          </span>
        </div>
        <S.LinkSection>
          <Button accent filled linkTo={slot.location}>
            Join with Whereby
          </Button>
          <S.Link
            href={slot.location}
            target="_blank"
            rel="noopener noreferrer"
          >
            upframe.whereby.com
          </S.Link>
        </S.LinkSection>
      </S.Main>
      <S.Status data-status={status} hidden={status === 'EXPIRED'}>
        {isMentor ? (
          <>
            <span>Going?</span>
            <Button
              accent
              filled={status === 'CONFIRMED'}
              onClick={() => accept()}
            >
              Yes
            </Button>
            <Button
              accent
              filled={status === 'DECLINED'}
              onClick={() => decline()}
            >
              No
            </Button>
          </>
        ) : (
          <>
            <S.Icon>
              <Icon
                icon={
                  status === 'CONFIRMED'
                    ? 'check'
                    : status === 'DECLINED'
                    ? 'close'
                    : 'bang'
                }
              />
            </S.Icon>
            <span>
              {status === 'PENDING'
                ? `Please wait for ${possessive(slot.mentor.name)} confirmation`
                : `${slot.mentor.name} has ${
                    status === 'CONFIRMED' ? 'accepted' : 'declined'
                  } the invitation`}
            </span>
          </>
        )}
      </S.Status>
    </S.Slot>
  )
}

const S = {
  Slot: styled.div`
    border: 1px solid #0003;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1.5rem;
    background-color: #fff;
  `,

  Main: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      span {
        color: #0008;
        margin-bottom: 0.2rem;

        svg {
          display: inline;
          vertical-align: -0.3rem;
          margin-right: 0.6rem;
          fill: #0008;
          height: 1.3rem;
        }
      }
    }

    *[data-browser='firefox'] & {
      flex-direction: row-reverse;

      & > div {
        flex-direction: column;
      }
    }
  `,

  Title: styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0.7rem;
  `,

  LinkSection: styled.div`
    button {
      margin-right: 0;
    }
  `,

  Link: styled.a`
    color: #636567;
    text-decoration: none;
    font-size: 0.9rem;

    &:visited {
      color: unset;
    }
  `,

  Status: styled.div`
    border-top: 1px solid;
    border-color: inherit;
    height: 3rem;
    margin: -1rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 1rem;
    background-color: #feeef2;

    &[data-status='PENDING'] {
      background-color: unset;
    }

    &[hidden] {
      display: none;
    }

    span {
      color: #ff4d7d;
      font-size: 0.8rem;
      font-weight: bold;
    }

    button {
      height: 70%;
      padding: 0;
      width: 5rem;
    }

    button:first-of-type {
      margin-left: 2rem;
    }
  `,

  Icon: styled.div`
    width: 1.3rem;
    height: 1.3rem;
    background-color: #ff4d7d;
    border-radius: 50%;
    margin-right: 0.8rem;
    position: relative;

    svg {
      height: 70%;
      fill: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  `,
}
