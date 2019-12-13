import React from 'react'
import styles from './intervalSelect.module.scss'

export default function IntervalSelect({
  options = ['Monthly', 'Weekly', 'Off'],
  onChange = () => {},
  selected,
}) {
  return (
    <div className={styles.select}>
      {options.map(v => (
        <button
          key={v}
          {...(v ===
            options[
              selected
                ? options
                    .map(v => v.toLowerCase())
                    .indexOf(selected.toLowerCase())
                : 0
            ] && { className: styles.active })}
          onClick={() => onChange(v.toLowerCase())}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
