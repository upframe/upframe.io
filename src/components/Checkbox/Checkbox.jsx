import React from 'react'
import styles from './checkbox.module.scss'
import Spinner from '../Spinner/Spinner'

export default function Checkbox({
  onChange,
  checked,
  color,
  loading = false,
}) {
  if (loading)
    return <Spinner className={styles.spinner} color={color || '#2c3976'} />
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
