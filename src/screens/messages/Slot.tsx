import React from 'react'
import styled from 'styled-components'
import { gql, useQuery } from 'gql'
import type * as T from 'gql/types'
import { ordNum } from 'utils/date'
import { Button, Icon } from 'components'

const SLOT_QUERY = gql`
  query ChannelMeetup($channelId: ID!) {
    channel(channelId: $channelId) {
      id
      slot {
        id
        time
        status
        location
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
  })} ${ordNum(date.getDate())} at ${new Date().toLocaleTimeString('en-US', {
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

  if (!slot) return null
  return (
    <S.Slot>
      <S.Main>
        <div>
          <S.Title>Video call with {slot.mentor.name}</S.Title>
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
    </S.Slot>
  )
}

const S = {
  Slot: styled.div`
    border: 1px solid #0003;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1.5rem;
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
  `,

  Title: styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0.6rem;
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
}
