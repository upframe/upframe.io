import React from 'react'
import styles from './card.module.scss'
import { classes } from '../../utils/css'
import { Link } from 'react-router-dom'

export default function Card({
  className,
  children,
  linkTo,
  article,
  ...props
}) {
  const Tag = linkTo ? Link : 'div'
  const ArtWrap = article ? 'article' : 'div'
  return (
    <ArtWrap>
      <Tag
        className={classes(styles.card, className, 'foo', 'bar', {
          something: 'long',
        })}
        to={linkTo}
        {...props}
      >
        {children}
      </Tag>
    </ArtWrap>
  )
}
