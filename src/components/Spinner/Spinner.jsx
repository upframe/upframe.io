import React from 'react'
import styles from './spinner.module.scss'
import { classes } from 'utils/css'

export default function Spinner({ centered = false, color, className }) {
  return (
    <svg
      className={classes(styles.spinner, className, {
        [styles.centered]: centered,
      })}
      data-active={true}
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="20"
        strokeDashoffset={0.5 * 81.68141 * -1}
        style={color && { stroke: color }}
      />
    </svg>
  )
}
