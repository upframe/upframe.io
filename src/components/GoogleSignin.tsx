import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Button, Icon, Spinner } from '.'
import { gql, useQuery } from 'gql'
import type * as T from 'gql/types'
import { useQueryParam, useHistory } from 'utils/hooks'

const SIGNIN_URL = gql`
  query GoogleSignInUrl(
    $redirect: String!
    $scope: GoogleAuthScope!
    $state: String
  ) {
    googleAuthUrl(redirect: $redirect, scope: $scope, state: $state)
  }
`

type Props = {
  verb?: string
  label?: string
  redirect?: string
  disabled?: boolean
  onCode?(code: string): void
  state?: string
  scope?: T.GoogleAuthScope
} & Parameters<typeof Button>[0]

export default function Google({
  verb = 'Sign in',
  label = `${verb} with Google`,
  redirect = window.location.origin + window.location.pathname,
  onCode,
  disabled = false,
  state,
  scope = 'SIGN_IN',
  ...props
}: Props) {
  const code = useQueryParam('code')
  const history = useHistory()

  const { data, loading } = useQuery<T.GoogleSignInUrl>(SIGNIN_URL, {
    variables: { redirect, state, scope },
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
      flex-shrink: 0;
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
        max-width: 1.9rem;
        max-height: 1.9rem;
        margin-right: 24px;
        flex-shrink: 0;
      }

      svg[data-icon='google'] {
        height: unset;
        width: unset;
      }

      span {
        flex-grow: 1;
        font-weight: 500;
      }
    }
  `,
}
