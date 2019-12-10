import React, { useState } from 'react'
import style from './input.module.scss'

export default function Input(props) {
  const [value, setValue] = useState('')
  if (props.value !== undefined && props.value !== value) setValue(props.value)

  function handleChange(e) {
    setValue(e.target.value)
    if (props.onChange) props.onChange(e.target.value)
  }

  return (
    <input
      className={style.input}
      id={props.id}
      value={value}
      onChange={handleChange}
      placeholder={props.placeholder}
    />
  )
}
