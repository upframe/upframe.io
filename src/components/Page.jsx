import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

export default function Page({ form = false, title, children, ...props }) {
  const Wrap = form ? S.Form : React.Fragment
  return (
    <>
      <Helmet>
        <title>{!title ? 'Upframe' : `${title} | Upframe`}</title>
      </Helmet>
      <Wrap {...props}>{children}</Wrap>
    </>
  )
}

const S = {
  Form: styled.form`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: block;
    padding: 1.5rem 3rem;
    border-radius: 0.25rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
  `,
}
