import React from 'react'

interface Props {
  label: string
  action: React.ReactElement
  wrap?: boolean | ((...props: any[]) => JSX.Element)
}

export default function Labeled({ label, action, wrap = false }: Props) {
  const Wrap = !wrap ? React.Fragment : wrap === true ? 'div' : wrap

  return (
    <Wrap>
      <label htmlFor={label}>{label}</label>
      {React.cloneElement(action, { id: label })}
    </Wrap>
  )
}
