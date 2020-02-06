import React from 'react'
import MentorCard from './MentorCard'

export default function MentorList({ mentors }) {
  return (
    <>
      {mentors.map(mentor => (
        <MentorCard key={mentor.keycode} mentor={mentor} />
      ))}
    </>
  )
}
