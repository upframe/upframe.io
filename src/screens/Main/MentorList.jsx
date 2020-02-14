import React from 'react'
import MentorCard from './MentorCard'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const FETCH_MENTORS = gql`
  query getMentors {
    mentors {
      name
      keycode
      role
      company
      bio
      profilePictures {
        size
        type
        url
      }
    }
  }
`

export default function MentorList() {
  const { data } = useQuery(FETCH_MENTORS)

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
