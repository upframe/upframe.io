import React from 'react'
import MentorCard from './MentorCard'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import fragments from '../../gql/fragments'

const MENTORS_QUERY = gql`
  query getMentors {
    mentors {
      ...LandingPageMentor
    }
  }
  ${fragments.landingPage.mentor}
`

export default function MentorList() {
  const { data } = useQuery(MENTORS_QUERY)

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
