import React from 'react'
import classes from './shade.module.scss'

export default function Shade({ children }) {
  return <div className={classes.shade}>{children}</div>
}
