import React, { useState } from 'react'
import MentorList from '../Main/MentorList'
import { gql, useQuery } from 'gql'
import * as fragments from 'gql/fragments'
import { Spinner } from 'components'
import type { SpaceMentors, SpaceMentorsVariables } from 'gql/types'

const MENTOR_QUERY = gql`
  query SpaceMentors($spaceId: ID!) {
    space(id: $spaceId) {
      id
      mentors {
        ...MentorDetails
        sortScore
      }
    }
  }
  ${fragments.person.mentorDetails}
`

interface Props {
  spaceId: string
}

export default function Mentors({ spaceId }: Props) {
  const [mentors, setMentors] = useState<any[]>([])

  const { loading } = useQuery<SpaceMentors, SpaceMentorsVariables>(
    MENTOR_QUERY,
    {
      variables: { spaceId },
      onCompleted({ space }) {
        if (!space?.mentors?.length) return
        const spaceMentors = [...space.mentors]
        const _mentors: any[] = []
        while (spaceMentors.length) {
          const mentor = spaceMentors.splice(
            (Math.random() * spaceMentors.length) | 0,
            1
          )[0]
          const pos = Math.min(
            _mentors.findIndex(
              ({ sortScore }) => sortScore >= (mentor.sortScore ?? 0)
            ) + 1,
            _mentors.length
          )
          _mentors.splice(pos, 0, mentor)
        }
        setMentors(_mentors ?? [])
      },
    }
  )

  if (loading) return <Spinner />
  return <MentorList mentors={mentors} />
}
