import React from 'react'
import styled from 'styled-components'
import { Button, Icon } from '../../components'
import { gql, useQuery } from '../../gql'

const SIGNIN_URL = gql`
  query GoogleSignInUrl($redirect: String!, $state: String) {
    googleSigninUrl(redirect: $redirect, state: $state)
  }
`

export default function Google({ state, redirect, ...props }) {
  const { data: { googleSigninUrl } = {} } = useQuery(SIGNIN_URL, {
    variables: { state, redirect },
  })

  return (
    <S.Google>
      <Button {...props} linkTo={googleSigninUrl}>
        <Icon icon="google" />
        <span>Sign up with Google</span>
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
      }

      span {
        flex-grow: 1;
      }
    }
  `,
}
