import React from 'react'
import { classes } from 'utils/css'
import styles from './text.module.scss'

export default function Text({
  children,
  strong = false,
  small = false,
  mark,
  underlined = false,
}) {
  return (
    <p
      className={classes(styles.text, {
        [styles.strong]: strong,
        [styles.small]: small,
        [styles.underlined]: underlined,
      })}
    >
      {mark && <mark>{children}</mark>}
      {!mark && children}
    </p>
  )
}
