import React from 'react'

export default function Labeled({ label, action, wrap = false }) {
  const Wrap = wrap ? 'div' : React.Fragment

  return (
    <Wrap>
      <label htmlFor={label}>{label}</label>
      {React.cloneElement(action, { id: label })}
    </Wrap>
  )
}
