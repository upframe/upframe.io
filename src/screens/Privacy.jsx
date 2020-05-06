import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Spinner, Page } from 'components'

export default function Privacy() {
  const [content, setContent] = useState()

  useEffect(() => {
    fetch('https://upframe-privacy.s3.eu-west-2.amazonaws.com/privacy.html')
      .then(res => res.text())
      .then(setContent)
  }, [])

  if (!content) return <Spinner centered />
  return (
    <Page
      title="Privacy"
      style={S.Privacy}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

const S = {
  Privacy: styled.div`
    box-sizing: border-box;
    padding: 1rem;
    max-width: 51rem;
    margin: auto;

    h2,
    h3 {
      margin-top: 2em;
    }

    hr + h2 {
      margin-top: 0;
    }

    hr {
      margin: 2rem 0;
      border: none;
      height: 1px;
      background-color: var(--border-lightgray);
    }

    a {
      text-decoration: underline;
    }

    table {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 1rem;
      overflow: hidden;
    }

    thead,
    tbody,
    tr {
      display: contents;
    }

    colgroup {
      display: none;
    }

    th:first-of-type {
      position: relative;
      display: block;

      &::before,
      &::after {
        content: '';
        display: block;
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        border-color: var(--border-lightgray);
        border-width: 1px;
      }

      &::before {
        width: 200%;
        height: 100%;
        border-bottom-style: solid;
      }

      &::after {
        width: 100%;
        height: 1000%;
        border-right-style: solid;
      }
    }

    tr {
      text-align: left;
    }
  `,
}
