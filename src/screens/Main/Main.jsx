import React from 'react'
import Landing from './Landing'
import MentorList from './MentorList'
import { Title, Text, Footer, LoginBar } from '../../components'
import Categories from './Categories'
import { useSelector } from 'utils/hooks'
import { queries, useQuery } from 'gql'
import Home from '../Home'

export default function Main() {
  const { loggedIn } = useSelector(s => s)
  const { data: { mentors = [] } = {} } = useQuery(queries.MENTORS)

  return (
    <>
      {!loggedIn && <Landing />}
      <Home>
        {loggedIn && (
          <>
            <Categories />
            <Title s2>Featured Mentors</Title>
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
      {!loggedIn && <LoginBar />}
    </>
  )
}
