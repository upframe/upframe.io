import React from 'react'
import styles from './checkbox.module.scss'

export default function Checkbox({ onChange, checked }) {
  return (
    <input
      type="checkbox"
      className={styles.checkbox}
      defaultChecked={checked}
      onClick={({ currentTarget }) => {
        if (onChange) onChange(currentTarget.checked)
      }}
    />
  )
}
