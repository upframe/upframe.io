import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Logo, SearchBar, Button } from 'components'
import Context from '../AppContext'
import UserIcon from './UserIcon'
import Dropdown from './Dropdown'
import { classes } from 'utils/css'
import { useScrollAtTop } from 'utils/Hooks'
import styles from './navbar.module.scss'

export default function Navbar() {
  const ctx = useContext(Context)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const atTop = useScrollAtTop()
  const history = useHistory()

  function search() {
    ctx.setSearchQuery(searchQuery)
    ctx.startSearchQuery(true)
    if (window.location !== '/') history.push('/')
  }

  function resetSearch() {
    ctx.searchQuery = ''
    ctx.isSearchQuery = false
    setSearchQuery('')
  }

  return (
    <nav className={classes(styles.navbar, { [styles.shadow]: !atTop })}>
      <Logo home onClick={resetSearch} />
      <SearchBar
        searchQuery={searchQuery}
        onChange={setSearchQuery}
        onSubmit={search}
      />
      <div className={styles.right}>
        {ctx.loggedIn && (
          <UserIcon
            user={ctx.user}
            onClick={() => {
              if (!showDropdown) setShowDropdown(true)
            }}
          />
        )}
        {!ctx.loggedIn && (
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
      {showDropdown && (
        <Dropdown ctx={ctx} onBlur={() => setShowDropdown(false)} />
      )}
    </nav>
  )
}
