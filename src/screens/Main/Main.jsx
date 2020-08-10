import React from 'react'
import Landing from './Landing'
import MentorList from './MentorList'
import { Title, Text, Footer } from '../../components'
import Categories from './Categories'
import { queries, useQuery } from 'gql'
import Home from '../Home'
import { useLoggedIn } from 'utils/hooks'

export default function Main() {
  const { data: { mentors = [] } = {} } = useQuery(queries.MENTORS)
  const loggedIn = useLoggedIn()

  return (
    <>
      {!loggedIn && <Landing />}
      <Home>
        {loggedIn && (
          <>
            <Categories />
            <Title size={2}>Featured Mentors</Title>
            <Text>
              Our in-house curators work alongside with startup founders,
              community shapers and domain experts across Europe to make sure
              you can find people who can help you tackle the challenges of
              today and tomorrow.
            </Text>
          </>
        )}

        {mentors.length > 0 && <MentorList mentors={mentors} />}
      </Home>
      <Footer />
    </>
  )
}
