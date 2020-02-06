import React, { useState, useEffect, useContext } from 'react'
import styles from './main.module.scss'
import Landing from './Landing'
import MentorList from './MentorList'
import Api from '../../utils/Api'
import context from '../../components/AppContext'
import { Title, Text } from '../../components'
import Categories from './Categories'
import aos from 'aos'
import 'aos/dist/aos.css'

export default function Main() {
  const [mentors, setMentors] = useState([])
  const [filtered, setFiltered] = useState([])
  const { searchQuery: search, loggedIn } = useContext(context)

  useEffect(() => {
    Api.getAllMentors(true).then(({ mentors }) => {
      const sorted = mentors.sort((a, b) => b.slots.length - a.slots.length)
      setMentors(sorted)
      setFiltered(sorted)
    })
    aos.init({
      duration: 350,
      delay: 0,
      offset: 0,
      throttleDelay: 0,
      once: true,
    })
  }, [])

  useEffect(() => {
    if (!search) return setFiltered(mentors)
    Api.searchFull(search).then(({ search }) => setFiltered(search))
  }, [search, mentors])

  return (
    <main className={styles.main}>
      {!loggedIn && !search && <Landing />}
      <div className={styles.container}>
        {loggedIn && !search && <Categories />}
        <Title s2 data-aos="fade-up" data-aos-delay="600" data-aos-offset="0">
          Featured Mentors
        </Title>
        <Text data-aos="fade-up" data-aos-delay="700" data-aos-offset="0">
          Our in-house curators work alongside with startup founders, community
          shapers and domain experts across Europe to make sure you can find
          people who can help you tackle the challenges of today and tomorrow.
        </Text>
        <MentorList mentors={filtered} />
      </div>
    </main>
  )
}
