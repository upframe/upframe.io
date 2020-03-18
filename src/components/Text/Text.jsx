import React from 'react'
import { classes } from 'utils/css'
import styles from './text.module.scss'

export default function Text({
  children,
  strong = false,
  small = false,
  bold = false,
  mark,
  underlined = false,
  inline = false,
  className,
  ...props
}) {
  if (children)
    children = (Array.isArray(children) ? children : [children]).map(child =>
      child.type === Text
        ? {
            ...child,
            props: {
              ...Object.fromEntries(
                Object.entries({
                  strong,
                  small,
                  bold,
                  mark,
                  underlined,
                }).flatMap(([k, v]) => (v ? [[k, true]] : []))
              ),
              ...child.props,
              inline: true,
            },
          }
        : child
    )

  const Tag = inline ? 'span' : 'p'
  return (
    <Tag
      className={classes(styles.text, className, {
        [styles.strong]: strong,
        [styles.small]: small,
        [styles.underlined]: underlined,
        [styles.bold]: bold,
      })}
      {...props}
    >
      {mark && <mark>{children}</mark>}
      {!mark && children}
    </Tag>
  )
}
