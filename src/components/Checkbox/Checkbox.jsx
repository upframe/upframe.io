import React from 'react'
import styles from './checkbox.module.scss'

export default function Checkbox({ onChange, checked, color }) {
  return (
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={checked || false}
      onChange={({ currentTarget }) => {
        onChange(currentTarget.checked)
      }}
      style={color && { backgroundColor: color, borderColor: color }}
      data-colored={color}
    />
  )
}
