import React from 'react'
import styles from './card.module.scss'
import { classes } from 'utils/css'
import { Link } from 'react-router-dom'
import { animated } from 'react-spring'

export default function Card({
  className,
  children,
  linkTo,
  hoverEffect = false,
  article,
  ...props
}) {
  const Tag = article ? animated.article : animated.div
  return (
    <Tag
      className={classes(styles.card, className, {
        [styles.hoverEffect]: hoverEffect,
      })}
      to={linkTo}
      {...props}
    >
      {!!linkTo && <Link className={styles.link} to={linkTo} />}
      {children}
    </Tag>
  )
}
