import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { render } from 'utils/markdown'

type Props = { markup: string } | { text: string }

const Markdown: React.FunctionComponent<Props> = ({ markup, text }: any) => {
  const [content, setContent] = useState(text ?? '')

  useEffect(() => {
    setContent(markup ?? render(text))
  }, [markup, text])

  return <S.Markdown dangerouslySetInnerHTML={{ __html: content }} />
}

const S = {
  Markdown: styled.div`
    line-height: 2rem;
  `,
}

export default Object.assign(Markdown, { sc: S.Markdown })
