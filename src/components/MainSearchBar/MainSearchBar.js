import React from 'react'
import styles from './MainSearchBar.module.scss'
import { Input } from '..'

export default function SearchBar({ onChange, onSubmit, searchQuery }) {
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.search} autoComplete="off">
      <Input
        type="text"
        placeholder="What are you looking for?"
        onChange={onChange}
        value={searchQuery}
        data-lpignore="true"
      />
    </form>
  )
}
