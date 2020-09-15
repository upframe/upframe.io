import React from 'react'
import { gql, useQuery, fragments } from 'gql'

const RECOMMENDATIONS = gql`
  query Recommendations($handles: [String]) {
    users(handles: $handles) {
      ...MentorProfile
    }
  }
  ${fragments.person.mentorProfile}
`

export default function ListsAdmin() {
  const { data: { users = [] } = {} } = useQuery(RECOMMENDATIONS, {
    variables: { handles },
    skip: !handles?.length,
  })

  return <div></div>
}
