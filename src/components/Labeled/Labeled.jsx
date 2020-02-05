import React from 'react'

export default function Labeled({ label, action }) {
  return (
    <div>
      <label htmlFor={label}>{label}</label>
      {React.cloneElement(action, { id: label })}
    </div>
  )
}
