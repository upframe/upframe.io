import React from 'react'
import { Link } from 'react-router-dom'
import styles from './categories.module.scss'
import { Title, Text } from '../../components'

export default function Categories() {
  return (
    <>
      <Title size={2}>Top Categories</Title>
      <Text>How can we help? Start by picking one of our main categories.</Text>
      <div className={styles.categories}>
        {['product', 'design', 'software'].map(v => (
          <Link key={v} to={`/list/${v}`}>
            {v}
          </Link>
        ))}
      </div>
    </>
  )
}
