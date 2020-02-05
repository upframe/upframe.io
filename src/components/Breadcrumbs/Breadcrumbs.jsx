import React from 'react'
import { Link } from 'react-router-dom'
import styles from './breadcrumbs.module.scss'

export default function Breadcrumbs({ name }) {
  return (
    <ul className={styles.crumbs}>
      <li>
        <Link to="/">Directory</Link>
      </li>
      <li>
        <Link to="/">People</Link>
      </li>
      <li>{name}</li>
    </ul>
  )
}
