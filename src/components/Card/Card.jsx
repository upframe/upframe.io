import React from 'react'
import styles from './card.module.scss'
import { classes } from '../../utils/css'
import { Link } from 'react-router-dom'

export default function Card({ className, children, linkTo, ...props }) {
  const Tag = linkTo ? Link : 'div'
  return (
    <Tag className={classes(styles.card, className)} to={linkTo} {...props}>
      {children}
    </Tag>
  )
}
