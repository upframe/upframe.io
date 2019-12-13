import React from 'react'
import styles from './changeBanner.module.scss'
import { Button } from 'components'

export default function ChangeBanner({ onSave, accent = true }) {
  return (
    <div className={styles.changeBanner}>
      <Button accent={accent} onClick={onSave}>
        Save Changes
      </Button>
    </div>
  )
}
