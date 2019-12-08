import React from 'react'
import { classes } from 'utils/css'
import styles from './text.module.scss'

export default function Text({
  children,
  strong = false,
  small = false,
  mark,
  underlined = false,
  inline = false,
}) {
  if (children)
    children = (Array.isArray(children) ? children : [children]).map(child =>
      child.type === Text
        ? { ...child, props: { ...child.props, inline: true } }
        : child
    )

  const Tag = inline ? 'span' : 'p'
  return (
    <Tag
      className={classes(styles.text, {
        [styles.strong]: strong,
        [styles.small]: small,
        [styles.underlined]: underlined,
      })}
    >
      {mark && <mark>{children}</mark>}
      {!mark && children}
    </Tag>
  )
}
