import React, { useState } from 'react'
import style from './textbox.module.scss'

export default function Textbox(props) {
  const [value, setValue] = useState('')
  if (props.value !== undefined && props.value !== value) setValue(props.value)

  function handleChange(e) {
    setValue(e.target.value)
    if (props.onChange) props.onChange(e.target.value)
  }

  return (
    <textarea
      className={style.textbox}
      id={props.id}
      rows="5"
      onChange={handleChange}
      value={props.value}
      placeholder={props.placeholder}
    ></textarea>
  )
}
