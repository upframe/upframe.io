import React from 'react'
import { Title, Text } from 'components'

interface Props {
  name: string
  description?: string
}

export default function ListInfo({ name, description }: Props) {
  return (
    <>
      <Title size={2}>{name.slice(0, 1).toUpperCase() + name.slice(1)}</Title>
      {description && <Text>{description}</Text>}
    </>
  )
}
