import React, { useState, useEffect } from 'react'
import styles from './main.module.scss'
import Landing from './Landing'
import MentorList from './MentorList'
import { Title, Text } from '../../components'
import Categories from './Categories'
import { useCtx } from '../../utils/Hooks'
import { queries, useQuery } from '../../gql'

export default function Main({ match }) {
  const [filtered, setFiltered] = useState([])
  const { searchQuery: search, currentUser } = useCtx()
  const category = match.url.split('/').pop()
  const { data: { mentors = [] } = {} } = useQuery(queries.MENTORS)

  useEffect(() => {
    if (!search && !category) {
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
    if (category)
      setFiltered(
        mentors.filter(({ categories }) => categories.includes(category))
      )
    // eslint-disable-next-line
  }, [search, mentors, category])

  return (
    <main className={styles.main}>
      {!currentUser && !search && <Landing />}
      <div className={styles.container}>
        {currentUser && !search && !category && (
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
      </div>
    </main>
  )
}
