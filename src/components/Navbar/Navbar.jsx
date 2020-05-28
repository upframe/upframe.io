import React, { useState } from 'react'
import { Logo, SearchBar, Button } from 'components'
import UserIcon from './UserIcon'
import Dropdown from './Dropdown'
import { classes } from 'utils/css'
import { useScrollAtTop, useCtx } from 'utils/hooks'
import styles from './navbar.module.scss'

export default function Navbar() {
  const ctx = useCtx()
  const [showDropdown, setShowDropdown] = useState(false)
  const atTop = useScrollAtTop()

  if (
    window.location.pathname
      .toLowerCase()
      .split('/')
      .filter(Boolean)[0] === 'signup'
  )
    return null
  return (
    <header
      className={classes(styles.navbar, { [styles.shadow]: !atTop })}
      data-signedin={!!ctx.currentUser}
    >
      <Logo home />
      <SearchBar />
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
