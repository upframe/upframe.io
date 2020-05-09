import React, { useState, useEffect } from 'react'
import { Input, Textbox, Text, Button } from 'components'
import style from './item.module.scss'
import { classes } from 'utils/css'

export default function Item({
  label,
  input,
  text,
  button,
  accent = false,
  custom,
  children,
  hint,
  onChange,
  required = false,
  error = false,
  inputType,
  className,
  linkTo,
  ...props
}) {
  const [value, setValue] = useState(input || text)

  useEffect(() => {
    setValue(input || text)
  }, [input, text])

  function handleChange(v) {
    setValue(v)
    if (onChange) onChange(v)
  }

  const action =
    input !== undefined ? 'input' : text !== undefined ? 'textbox' : undefined
  const Action = { input: Input, textbox: Textbox }[action]

  const id = label.replace(/\s/g, '')
  return (
    <div
      className={classes(style.item, className)}
      data-type={error ? 'error' : undefined}
      data-action={action}
      data-label={label?.toLowerCase()}
    >
      <label htmlFor={id}>
        {label}
        {!required ? '' : <span> *</span>}
      </label>
      {Action && !button && (
        <Action
          id={id}
          value={value}
          onChange={handleChange}
          error={error}
          {...(inputType && { type: inputType })}
          {...props}
        />
      )}
      {(button || custom) && (
        <div className={style.btWrap}>
          <Text>{children}</Text>
          {button && (
            <Button
              {...(linkTo ? { linkTo } : { onClick: onChange })}
              accent={accent}
            >
              {button}
            </Button>
          )}
          {custom}
        </div>
      )}
      {(hint || typeof hint === 'string') && (
        <p className={style.hint}>{hint}</p>
      )}
    </div>
  )
}
