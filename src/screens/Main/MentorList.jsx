import React from 'react'
import MentorCard from './MentorCard'
import { Text } from 'components'

export default function MentorList({ mentors }) {
  return (
    <>
      {mentors?.length ? (
        mentors.map(mentor => (
          <MentorCard key={mentor.handle} mentor={mentor} />
        ))
      ) : (
        <Text>No mentors found.</Text>
      )}
    </>
  )
}
