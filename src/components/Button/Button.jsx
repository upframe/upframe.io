import React from 'react'
import styles from './button.module.scss'

export default function Button({ children, onClick, accent = false } = {}) {
  return (
    <button
      className={[styles.button, ...(accent ? [styles.accent] : [])].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
