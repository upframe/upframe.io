import React from 'react'
import styles from './text.module.scss'

export default function Text({ children }) {
  return <p className={styles.text}>{children}</p>
}
