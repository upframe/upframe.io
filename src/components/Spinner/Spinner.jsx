import React from 'react'
import styles from './spinner.module.scss'

export default function Spinner() {
  return (
    <svg className={styles.spinner} data-active={true}>
      <circle
        cx="2.5rem"
        cy="2.5rem"
        r="20"
        strokeDashoffset={0.5 * 81.68141 * -1}
      />
    </svg>
  )
}
