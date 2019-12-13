import React from 'react'
import { Link } from 'react-router-dom'
import { classes } from 'utils/css'
import styles from './button.module.scss'

export default function Button({
  children,
  onClick,
  accent = false,
  className,
  linkTo,
  newTab = false,
}) {
  const Button = (
    <button
      className={classes(styles.button, className, { [styles.accent]: accent })}
      onClick={onClick}
    >
      {children}
    </button>
  )
  if (!linkTo) return Button
  return (
    <Link
      className={styles.linKWrap}
      to={linkTo}
      {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {Button}
    </Link>
  )
}
