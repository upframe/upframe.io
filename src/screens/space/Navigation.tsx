import React from 'react'
import { Navbar } from 'components'
import { path } from 'utils/url'
import { useHistory } from 'react-router-dom'
import { mobile } from 'styles/responsive'
import { useMatchMedia } from 'utils/hooks'

const routes = {
  Mentors: '',
  People: '/people',
  Settings: '/settings',
  'Activity Log': '/activity',
  Info: '/info',
}

export default function Navigation({ isOwner }: { isOwner: boolean }) {
  useHistory()
  const isMobile = useMatchMedia(mobile)

  const tabs = Object.fromEntries(
    Object.entries(routes)
      .slice(0, isMobile ? Infinity : -1)
      .filter(
        isOwner ? Boolean : ([k]) => !['Settings', 'Activity Log'].includes(k)
      )
      .map(([k, v]) => [k, path(2) + v])
  )

  return (
    <Navbar
      tabs={tabs}
      active={Object.entries(tabs).find(([, v]) => v === path())?.[0]}
    />
  )
}
