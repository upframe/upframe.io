import React from 'react'
import styled from 'styled-components'
import { Button } from '.'

export default function LoginBar() {
  return (
    <S.Bar>
      <Button
        filled
        linkTo="https://www.producthunt.com/upcoming/upframe"
        newTab
      >
        Get Invite
      </Button>
      <Button accent linkTo="/login">
        Log in
      </Button>
    </S.Bar>
  )
}

const S = {
  Bar: styled.div`
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 4rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 0 5vw;
    z-index: 5001;

    @media (min-width: 751px) {
      display: none;
    }

    button {
      margin: 0;
      width: 45%;
    }
  `,
}
