import React, { useState } from 'react'
import { Input, Textbox } from 'components'
import style from './item.module.scss'

export default function Item({ label, input, text, hint, onChange }) {
  const [value, setValue] = useState(input || text)

  function handleChange(v) {
    setValue(v)
    if (onChange) onChange(v)
  }

  const Action =
    input !== undefined ? Input : text !== undefined ? Textbox : undefined

  const id = label.replace(/\s/g, '')
  return (
    <div className={style.item}>
      <label htmlFor={id}>{label}</label>
      {Action && <Action id={id} value={value} onChange={handleChange} />}
      {hint && <p className={style.hint}>{hint}</p>}
    </div>
  )
}
