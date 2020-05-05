import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Spinner } from 'components'

export default function Privacy() {
  const [content, setContent] = useState()

  useEffect(() => {
    fetch('https://upframe-privacy.s3.eu-west-2.amazonaws.com/privacy.html')
      .then(res => res.text())
      .then(setContent)
  }, [])

  if (!content) return <Spinner centered />
  return <S.Privacy dangerouslySetInnerHTML={{ __html: content }} />
}

const S = {
  Privacy: styled.div`
    box-sizing: border-box;
    padding: 1rem;
    max-width: 60rem;
    margin: auto;
  `,
}
