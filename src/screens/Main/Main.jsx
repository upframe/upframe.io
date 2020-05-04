import React, { useState, useEffect } from 'react'
import Landing from './Landing'
import MentorList from './MentorList'
import { Title, Text } from '../../components'
import Categories from './Categories'
import { useCtx } from 'utils/hooks'
import { queries, useQuery } from 'gql'
import Home from '../Home'

export default function Main() {
  const [filtered, setFiltered] = useState([])
  const { searchQuery: search, currentUser } = useCtx()
  const [loggedIn] = useState(localStorage.getItem('loggedin') === 'true')
  const { data: { mentors = [] } = {} } = useQuery(queries.MENTORS)

  useEffect(() => {
    if (!mentors.length) return
    if (!search) {
      if (filtered.length === mentors.length) return
      return setFiltered(mentors)
    }
    if (search)
      setFiltered(
        mentors.filter(({ name }) =>
          name
            .split(' ')
            .some(v => v.toLowerCase().startsWith(search.toLowerCase()))
        )
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, mentors])

  return (
    <>
      {!currentUser && !loggedIn && !search && <Landing />}
      <Home>
        {currentUser && !search && (
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

        <MentorList mentors={filtered} />
      </Home>
    </>
  )
}
