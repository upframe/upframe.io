import React from 'react'
import { classes } from 'utils/css'
import styles from './text.module.scss'

export default function Text({
  children,
  strong = false,
  small = false,
  mark,
}) {
  return (
    <p
      className={classes(styles.text, {
        [styles.strong]: strong,
        [styles.small]: small,
      })}
    >
      {mark && <mark>{children}</mark>}
      {!mark && children}
    </p>
  )
}
