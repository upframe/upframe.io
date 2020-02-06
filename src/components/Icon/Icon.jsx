import React from 'react'
import styles from './icon.module.scss'
import { classes } from '../../utils/css'

export default function Icon({ icon = 'info', onClick }) {
  return (
    <svg
      className={classes(styles.icon, { [styles.clickable]: onClick })}
      xmlns="http://www.w3.org/2000/svg"
      width={svg[icon].size || '24'}
      height={svg[icon].size || '24'}
      viewBox={`0 0 ${svg[icon].size || '24'} ${svg[icon].size || '24'}`}
      {...{ onClick }}
    >
      <path d={svg[icon].path} />
    </svg>
  )
}

const svg = {
  info: {
    path:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  },
  arrow_back: {
    path: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  },
  arrow_down: {
    path: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  },
  arrow_up: {
    path: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  },
  close: {
    path:
      'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  },
  add: {
    path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  },
  location: {
    path:
      'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  },
}
