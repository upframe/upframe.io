import React from 'react'
import MentorCard from './MentorCard'
import { Text } from 'components'
import { useTrail, config } from 'react-spring'

export default function MentorList({ mentors }) {
  const trail = useTrail(
    Math.min(Math.ceil(window.innerHeight / 230), mentors.length),
    {
      opacity: 1,
      transform: 'translateY(0)',
      config: config.stiff,
      from: {
        opacity: 0,
        transform: 'translateY(1rem)',
      },
    }
  )

  return (
    <>
      {mentors?.length ? (
        mentors.map((mentor, i) => (
          <MentorCard mentor={mentor} style={trail[i]} key={mentor.id} />
        ))
      ) : (
        <Text>No mentors found.</Text>
      )}
    </>
  )
}
