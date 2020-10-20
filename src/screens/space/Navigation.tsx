import React from 'react'
import { Navbar } from 'components'
import { path } from 'utils/url'
import { useHistory } from 'react-router-dom'

const routes = {
  Mentors: '',
  People: '/people',
  Settings: '/settings',
  'Activity  Log': '/activity',
}

export default function Navigation() {
  useHistory()

  const tabs = Object.fromEntries(
    Object.entries(routes).map(([k, v]) => [k, path(2) + v])
  )

  return (
    <Navbar
      tabs={tabs}
      active={Object.entries(tabs).find(([, v]) => v === path())?.[0]}
    />
  )
}
