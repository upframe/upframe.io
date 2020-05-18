import React from 'react'
import { Link as InternalLink } from 'react-router-dom'
import { classes } from 'utils/css'
import styles from './button.module.scss'
import { Spinner } from '..'

export default function Button({
  children,
  onClick,
  accent = false,
  warn = false,
  className,
  linkTo,
  newTab = false,
  filled = false,
  text = false,
  type,
  loading = false,
  disabled = loading,
  hidden = false,
}) {
  const Button = (
    <button
      className={classes(styles.button, className, {
        [styles.accent]: accent,
        [styles.warn]: warn,
        [styles.filled]: filled,
        [styles.text]: text,
        [styles.loading]: loading,
      })}
      onClick={onClick}
      {...(type && { type })}
      disabled={disabled}
      hidden={hidden}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
  if (!linkTo) return Button
  const Link = /http(s?):\/\//.test(linkTo) ? 'a' : InternalLink
  return (
    <Link
      className={styles.linkWrap}
      {...{ [Link === 'a' ? 'href' : 'to']: linkTo }}
      {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {Button}
    </Link>
  )
}
