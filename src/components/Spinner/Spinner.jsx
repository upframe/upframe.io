import React from 'react'
import styles from './spinner.module.scss'
import { classes } from '../../utils/css'

export default function Spinner({ centered = false }) {
  return (
    <svg
      className={classes(styles.spinner, { [styles.centered]: centered })}
      data-active={true}
    >
      <circle
        cx="2.5rem"
        cy="2.5rem"
        r="20"
        strokeDashoffset={0.5 * 81.68141 * -1}
      />
    </svg>
  )
}
