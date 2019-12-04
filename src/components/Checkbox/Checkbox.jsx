import React from 'react'
import styles from './checkbox.module.scss'

export default function Checkbox({ onChange }) {
  return (
    <input
      type="checkbox"
      className={styles.checkbox}
      {...(onChange && { onChange })}
    />
  )
}
