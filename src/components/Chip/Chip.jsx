import React from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'components'
import styles from './chip.module.scss'

export default function Chip({
  children,
  onClick = () => {},
  removable = false,
  highlight,
  link = !removable,
}) {
  const Tag = link ? Link : 'div'
  return (
    <Tag
      className={styles.chip}
      onClick={() => onClick(children)}
      {...(highlight && { 'data-highlight': true })}
      {...(link && { to: `/tag/${children}` })}
    >
      <Text>{children}</Text>
      {removable && <span>×</span>}
    </Tag>
  )
}
