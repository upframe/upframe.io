import React from 'react'
import MentorCard from './MentorCard'

export default function MentorList({ mentors }) {
  return (
    <>
      {mentors &&
        mentors.map(mentor => (
          <MentorCard key={mentor.keycode} mentor={mentor} />
        ))}
    </>
  )
}
