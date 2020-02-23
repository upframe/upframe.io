import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Logo, SearchBar, Button } from 'components'
import UserIcon from './UserIcon'
import Dropdown from './Dropdown'
import { classes } from 'utils/css'
import { useScrollAtTop, useCtx } from 'utils/Hooks'
import styles from './navbar.module.scss'

export default function Navbar() {
  const ctx = useCtx()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const atTop = useScrollAtTop()
  const history = useHistory()

  function search() {
    ctx.setSearchQuery(searchQuery)
    if (window.location !== '/') history.push('/')
  }

  function resetSearch() {
    setSearchQuery('')
    ctx.setSearchQuery('')
  }

  return (
    <header className={classes(styles.navbar, { [styles.shadow]: !atTop })}>
      <Logo home onClick={resetSearch} />
      <SearchBar
        searchQuery={searchQuery}
        onChange={setSearchQuery}
        onSubmit={search}
      />
      <div className={styles.right}>
        {ctx.currentUser && (
          <UserIcon
            userId={ctx.currentUser}
            onClick={() => {
              if (!showDropdown) setShowDropdown(true)
            }}
          />
        )}
        {!ctx.currentUser && (
          <>
            <Button text linkTo="/login">
              Sign in
            </Button>
            <Button
              filled
              linkTo="https://www.producthunt.com/upcoming/upframe"
              newTab={true}
            >
              Get Early Access
            </Button>
          </>
        )}
      </div>
      {showDropdown && <Dropdown onBlur={() => setShowDropdown(false)} />}
    </header>
  )
}
