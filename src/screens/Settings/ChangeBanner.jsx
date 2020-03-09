import React, { useEffect } from 'react'
import styles from './changeBanner.module.scss'
import { Button } from 'components'
import { pad } from '../../notification'

export default function ChangeBanner({ onSave, accent = true }) {
  useEffect(() => {
    pad('5rem')
    return pad
  })

  return (
    <div className={styles.changeBanner}>
      <Button accent={accent} onClick={onSave}>
        Save Changes
      </Button>
    </div>
  )
}
