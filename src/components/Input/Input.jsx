import React, { useState } from 'react'
import styles from './input.module.scss'
import { classes } from 'utils/css'

export default function Input({ password = false, ...props }) {
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
      {...(password && { type: 'password' })}
    />
  )
}
