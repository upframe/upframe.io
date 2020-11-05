import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

interface Props {
  title?: string
  form?: boolean
  style?(): JSX.Element
  onSubmit?(e?: React.FormEvent<HTMLFormElement>): void
  defaultStyle?: boolean
  className?: string
  wrap?: boolean
}

const Page: React.FC<Props> = ({
  form = false,
  wrap = form,
  title,
  style,
  children,
  onSubmit,
  defaultStyle = false,
  ...props
}) => {
  const Wrap: any = form || wrap ? S.Form : style ? S.Page : React.Fragment
  const wrapProps: any = {
    'data-style':
      !defaultStyle && (style || props.className) ? 'cst' : 'default',
    ...(style && { as: style }),
    ...(form && {
      onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        onSubmit?.(e)
      },
    }),
    ...(wrap && !form && { as: 'div' }),
  }

  return (
    <>
      <Helmet>
        <title>{!title ? 'Upframe' : `${title} | Upframe`}</title>
      </Helmet>
      <Wrap {...props} {...(Wrap !== React.Fragment && wrapProps)}>
        {children}
      </Wrap>
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
    border-radius: var(--border-radius);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    width: 26rem;
    max-width: 100vw;

    &[data-style='default'] {
      *:first-child {
        margin-top: 0;
      }

      *:last-child {
        margin-bottom: 0;
      }

      input,
      button {
        margin: 1rem 0;
        width: 100%;
      }

      label + input {
        margin-top: 0;
      }

      input:not(:first-of-type) + input {
        margin-top: 0;
      }

      hr {
        margin: 2rem 0;
      }
    }
  `,

  Page: styled.div``,
}

export default Object.assign(Page, S)
