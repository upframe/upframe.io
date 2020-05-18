import React, { useState, useEffect } from 'react'
import style from './textbox.module.scss'

export default function Textbox(props) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (props.value === undefined) return
    setValue(props.value)
  }, [props.value])

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
      value={value}
      placeholder={props.placeholder}
    ></textarea>
  )
}
