import React, { useState } from 'react'
import styles from './intervalSelect.module.scss'

export default function IntervalSelect({
  options = ['Monthly', 'Weekly', 'Off'],
  onChange = () => {},
}) {
  const [active, setActive] = useState(options.slice(-1)[0])

  return (
    <div className={styles.select}>
      {options.map(v => (
        <button
          key={v}
          {...(v === active && { className: styles.active })}
          onClick={() => {
            setActive(v)
            onChange(v)
          }}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
