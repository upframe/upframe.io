import React from 'react'
import styles from './MainSearchBar.module.scss'

export default function SearchBar({ onChange, onSubmit, searchQuery }) {
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.search}>
      <input
        type="text"
        placeholder="What are you looking for?"
        onChange={({ target }) => onChange(target.value)}
        value={searchQuery}
      />
    </form>
  )
}
