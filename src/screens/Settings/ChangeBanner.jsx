import React from 'react'
import styles from './changeBanner.module.scss'
import { Button } from 'components'

export default function ChangeBanner({ onSave }) {
  return (
    <div className={styles.changeBanner}>
      <Button accent onClick={onSave}>
        Save Changes
      </Button>
    </div>
  )
}
