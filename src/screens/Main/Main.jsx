import React, { useState, useEffect } from 'react'
import styles from './main.module.scss'
import Landing from './Landing'
import MentorList from './MentorList'
import Api from '../../utils/Api'
import { Title, Text } from '../../components'
import Categories from './Categories'
import { useCtx } from '../../utils/Hooks'

export default function Main({ match }) {
  const [mentors, setMentors] = useState([])
  const [filtered, setFiltered] = useState([])
  const { searchQuery: search, loggedIn } = useCtx()

  const category = match.url.split('/').pop()

  useEffect(() => {
    Api.getAllMentors(true).then(({ mentors }) => {
      const sorted = mentors.sort((a, b) => b.slots.length - a.slots.length)
      setMentors(sorted)
      setFiltered(sorted)
    })
  }, [])

  useEffect(() => {
    if (!search && !category) return setFiltered(mentors)
    Api.searchFull(category || search).then(({ search }) => setFiltered(search))
  }, [search, mentors, category])

  return (
    <main className={styles.main}>
      {!loggedIn && !search && <Landing />}
      <div className={styles.container}>
        {loggedIn && !search && !category && (
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
