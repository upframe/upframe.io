import React from 'react'
import styled from 'styled-components'
import { Button, Icon } from '.'
import { gql, useQuery } from '../gql'

const SIGNIN_URL = gql`
  query GoogleSignInUrl($redirect: String!, $state: String) {
    googleSigninUrl(redirect: $redirect, state: $state)
  }
`
const SIGNUP_URL = gql`
  query GoogleSignUpUrl($redirect: String!, $state: String) {
    googleSignupUrl(redirect: $redirect, state: $state)
  }
`

export default function Google({
  verb = 'Sign in',
  text = `${verb} with Google`,
  state,
  redirect = window.location.origin + window.location.pathname,
  signup = false,
  ...props
}) {
  const { data = {} } = useQuery(signup ? SIGNUP_URL : SIGNIN_URL, {
    variables: { state, redirect },
  })

  return (
    <S.Google>
      <Button
        {...props}
        linkTo={data[signup ? 'googleSignupUrl' : 'googleSigninUrl']}
      >
        <Icon icon="google" />
        <span>{text}</span>
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
        height: 1.5rem;
        width: 1.5rem;
        margin-right: 0.75rem;
      }

      span {
        flex-grow: 1;
      }
    }
  `,
}
