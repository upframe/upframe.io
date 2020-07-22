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

const title = 'h1, h2, h3, h4, h5, h6'

const S = {
  Markdown: styled.div`
    font-size: 1rem;
    display: contents;

    & > * {
      margin: 0;
    }

    p {
      font-size: 1em;
      line-height: 1.5em;
    }

    ${title} {
      line-height: 1.25em;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2em;
      border-bottom: 1px solid var(--border-lightgray);
    }

    h2 {
      font-size: 1.5em;
      border-bottom: 1px solid var(--border-lightgray);
    }

    h3 {
      font-size: 1.25em;
    }

    h4 {
      font-size: 1rem;
    }

    & > *:first-child {
      margin-top: 0;
    }
  `,
}

export default Object.assign(Markdown, { sc: S.Markdown })
