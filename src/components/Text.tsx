import React from 'react'
import styled from 'styled-components'
import { compose } from 'utils/array'

interface Props {
  strong?: boolean
  small?: boolean
  bold?: boolean
  mark?: boolean
  underlined?: boolean
  abbr?: false | string
  inline?: boolean
  className?: string
}

const Text: React.FC<Props> = ({
  children,
  strong = false,
  small = false,
  bold = false,
  mark,
  underlined = false,
  abbr = false,
  inline = false,
  className,
  ...props
}) => {
  if (children)
    children = (Array.isArray(children) ? children : [children]).map(child =>
      // eslint-disable-next-line
      (child as any)?.type === Text
        ? {
            ...(child as any),
            props: {
              ...Object.fromEntries(
                Object.entries({
                  strong,
                  small,
                  bold,
                  mark,
                  underlined,
                }).flatMap(([k, v]) => (v ? [[k, true]] : []))
              ),
              ...(child as any).props,
              inline: true,
            },
          }
        : child
    )

  return (
    // @ts-ignore
    <S.Text
      {...(inline && { as: 'span' })}
      {...(abbr && { as: 'abbr', title: abbr })}
      {...props}
      className={className}
      data-mode={compose([
        [strong, 'strong'],
        [small, 'small'],
        [underlined, 'underlined'],
        [bold, 'bold'],
      ]).join(' ')}
    >
      {mark && <mark>{children}</mark>}
      {!mark && children}
    </S.Text>
  )
}

const S = {
  Text: styled.p`
    font-size: 1rem;
    color: var(--cl-text-medium);
    margin-bottom: 1rem;

    mark {
      background-color: var(--cl-accent-light);
      color: inherit;
    }

    p {
      display: inline;
    }

    &[data-mode~='strong'] {
      color: var(--cl-text-strong);
    }

    &[data-mode~='small'] {
      font-size: 14px;
    }

    &[data-mode~='underlined'] {
      text-decoration: underline;
    }

    &[data-mode~='bold'] {
      font-weight: bold;
    }
  `,
}
export default Object.assign(Text, { sc: S.Text })
