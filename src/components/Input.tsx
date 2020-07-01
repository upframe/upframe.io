import React from 'react'
import styles from './input.module.scss'
import { classes } from 'utils/css'

export default function Input({
  type = 'text',
  id,
  value = '',
  onChange = () => {},
  changeTarget = false,
  placeholder,
  error = false,
  ...props
}) {
  return (
    <input
      className={classes(styles.input, { [styles.error]: error })}
      id={id}
      value={value}
      onChange={({ target }) => onChange(changeTarget ? target : target.value)}
      placeholder={placeholder}
      type={type}
      {...(type === 'text' && { 'data-lpignore': true })}
      {...props}
    />
  )
}
