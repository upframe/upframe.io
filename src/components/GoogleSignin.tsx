import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Button, Icon, Spinner } from '.'
import { gql, useQuery } from 'gql'
import type * as T from 'gql/types'
import { useQueryParam, useHistory } from 'utils/hooks'

const SIGNIN_URL = gql`
  query GoogleSignInUrl($redirect: String!) {
    googleAuthUrl(redirect: $redirect)
  }
`

type Props = {
  verb?: string
  label?: string
  redirect?: string
  disabled?: boolean
  onCode?(code: string): void
} & Parameters<typeof Button>[0]

export default function Google({
  verb = 'Sign in',
  label = `${verb} with Google`,
  redirect = window.location.origin + window.location.pathname,
  onCode,
  disabled = false,
  ...props
}: Props) {
  const code = useQueryParam('code')
  const history = useHistory()

  const { data, loading } = useQuery<T.GoogleSignInUrl>(SIGNIN_URL, {
    variables: { redirect },
    skip: !!(disabled || code),
  })

  useEffect(() => {
    if (!code || !history) return
    onCode?.(code)
    setTimeout(() => history.replace(window.location.pathname), 100)
  }, [code, onCode, history])

  return (
    <S.Google>
      <Button
        {...props}
        disabled={disabled || loading}
        linkTo={data?.googleAuthUrl ?? ''}
        newTab={false}
      >
        {loading ? <Spinner /> : <Icon icon="google" />}
        <span>{label}</span>
      </Button>
    </S.Google>
  )
}

const S = {
  Google: styled.div`
    display: contents;

    button {
      font-family: 'Roboto', sans-serif;
      display: flex;
      align-items: center;
      padding-left: 1rem;
      color: var(--cl-text-strong);

      &:hover:not([disabled]) {
        background-color: unset;
        color: var(--cl-text-strong);
      }

      svg {
        width: 2rem;
        height: 2rem;
        margin-right: 0.75rem;
      }

      svg[data-icon='google'] {
        height: 1.5rem;
        width: 1.5rem;
      }

      span {
        flex-grow: 1;
      }
    }
  `,
}
