import styled from 'styled-components'

export const Frame = styled.div`
  position: relative;
  display: block;
  background-color: #f7f7f7;
  overflow: hidden;
  height: 25rem;
  width: 30rem;
`

export const Img = styled.img`
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  user-select: none;
`

export const Selection = styled.div`
  position: absolute;
  display: block;
  box-sizing: border-box;
  cursor: pointer;

  svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    --dash-size: 5px;

    rect {
      fill: none;
      stroke: #fff;
      stroke-width: 2px;
      stroke-dasharray: var(--dash-size);
      animation: revolve-border 10s linear infinite;
    }

    rect:first-of-type {
      animation-name: revolve-border1;

      @keyframes revolve-border1 {
        to {
          stroke-dashoffset: calc(var(--dash-size) * 20);
        }
      }
    }

    rect:last-of-type {
      stroke: #0008;
      stroke-dashoffset: var(--dash-size);
      animation-name: revolve-border2;

      @keyframes revolve-border2 {
        from {
          stroke-dashoffset: var(--dash-size);
        }

        to {
          stroke-dashoffset: calc(var(--dash-size) * 21);
        }
      }
    }
  }

  &[data-grabbed='true'] {
    cursor: move;
  }
`

export const Vt = styled.div`
  position: absolute;
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  transform: translateX(-50%) translateY(-50%);

  &::after {
    content: '';
    position: absolute;
    display: block;

    --size: 0.6rem;

    width: var(--size);
    height: var(--size);
    left: calc((100% - var(--size)) / 2);
    top: calc((100% - var(--size)) / 2);
    background: var(--cl-secondary);
    border: 1px solid #fff;
    border-radius: 50%;
  }

  &:nth-of-type(1) {
    cursor: nwse-resize;
  }

  &:nth-of-type(2) {
    left: 100%;
    cursor: nesw-resize;
  }

  &:nth-of-type(3) {
    left: 100%;
    top: 100%;
    cursor: nwse-resize;
  }

  &:nth-of-type(4) {
    top: 100%;
    cursor: nesw-resize;
  }
`

export const Preview = styled.div`
  display: flex;
  align-items: center;
`

export const PreviewImgWrap = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: calc(var(--border-radius) / 2);
  overflow: hidden;
`

export const Name = styled.p`
  color: #000;
  font-weight: bold;
  margin-left: 1rem;
  margin-top: 0;
  margin-bottom: 0;

  &::after {
    content: '';
    display: block;
    margin-top: 0.4rem;
    width: 10rem;
    height: 0.8rem;
    border-radius: 0.4rem;
    background: #e9e9e9;
  }
`
