import React from 'react'
import classes from './shade.module.scss'

export default function Shade({ children, onClick }) {
  return (
    <div className={classes.shade} {...(onClick && { onClick })}>
      {children}
    </div>
  )
}
