import React, { useState } from 'react'
import styles from './input.module.scss'
import { classes } from 'utils/css'

export default function Input({ type = 'text', ...props }) {
  const [value, setValue] = useState('')
  if (props.value !== undefined && props.value !== value) setValue(props.value)

  function handleChange(e) {
    setValue(e.target.value)
    if (props.onChange) props.onChange(e.target.value)
  }

  return (
    <input
      className={classes(styles.input, { [styles.error]: props.error })}
      id={props.id}
      value={value}
      onChange={handleChange}
      placeholder={props.placeholder}
      type={type}
      {...(type === 'text' && { 'data-lpignore': true })}
      {...Object.fromEntries(
        Object.entries(props).filter(([k]) => k.startsWith('data-'))
      )}
    />
  )
}
