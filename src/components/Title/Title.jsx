import React from 'react'
import styles from './title.module.scss'

export default function Title(props) {
  const size = [1, 2, 3, 4, 5, 6].find(n => props[`s${n}`]) || 2
  const Tag = `h${size}`
  return (
    <Tag
      className={styles.title}
      data-size={size}
      {...Object.fromEntries(
        Object.entries(props).filter(([k]) => k.startsWith('data-'))
      )}
    >
      {props.children}
    </Tag>
  )
}
