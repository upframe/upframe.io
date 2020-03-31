import React from 'react'

export default function Labeled({ label, action }) {
  return (
    <>
      <label htmlFor={label}>{label}</label>
      {React.cloneElement(action, { id: label })}
    </>
  )
}
