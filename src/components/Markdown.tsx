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

    & > *:first-child:not(table) {
      margin-top: 0;
    }

    p,
    q {
      font-size: 1em;
      line-height: 1.5em;
      margin: 0;
    }

    ${title} {
      line-height: 1.25em;
      margin-top: 1.5em;
      margin-bottom: 1em;
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
      font-size: 1em;
    }

    ul {
      padding-left: 1.2em;
    }

    table {
      display: grid;
      grid-template-columns: repeat(var(--columns), auto);
      grid-gap: 0;
      overflow: hidden;
      padding-top: 1px;
      padding-left: 1px;
      margin: 1em 0;

      thead,
      tbody,
      tr {
        display: contents;
      }

      th,
      td {
        text-align: left;
        border: 1px solid black;
        margin-top: -1px;
        margin-left: -1px;
        padding-left: 0.5em;
      }
    }

    blockquote {
      padding-left: 0.75em;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        display: block;
        height: 100%;
        width: 0.25em;
        left: 0;
        background-color: var(--cl-text-light);
        border-radius: 1000px;
      }
    }

    a {
      color: var(--cl-secondary);
      text-decoration: underline var(--cl-secondary);
      text-underline-position: below;
    }
  `,
}

export default Object.assign(Markdown, { sc: S.Markdown })
