import React from 'react'
import MentorCard from './MentorCard'
import { queries, useQuery } from '../../gql'

export default function MentorList() {
  const { data } = useQuery(queries.MENTORS)

  return (
    <>
      {data &&
        data.mentors &&
        data.mentors.map(mentor => (
          <MentorCard key={mentor.keycode} mentor={mentor} />
        ))}
    </>
  )
}
