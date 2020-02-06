import React from 'react'
import styles from './card.module.scss'
import { classes } from '../../utils/css'

export default function Card({ className, children }) {
  return <div className={classes(styles.card, className)}>{children}</div>
}
