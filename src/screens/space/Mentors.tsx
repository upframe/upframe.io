import React from 'react'
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
      }
    }
  }
  ${fragments.person.mentorDetails}
`

interface Props {
  spaceId: string
}

export default function Mentors(variables: Props) {
  const { data, loading } = useQuery<SpaceMentors, SpaceMentorsVariables>(
    MENTOR_QUERY,
    { variables }
  )

  if (loading) return <Spinner />
  return <MentorList mentors={data?.space?.mentors} />
}
