import styled from 'styled-components'
import PaginationInterface from './Pagination'

export const Cell = styled.div<{ clickable?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--row-height);
  background-color: var(--row-color);
  box-sizing: border-box;
  padding: 0 var(--cell-padding);
  overflow: hidden;
  /* stylelint-disable-next-line */
  ${({ clickable }) => (clickable ? `cursor: pointer;` : '')}
`

export const Row = styled.div`
  display: contents;

  --row-color: #fff;
  --row-transparent: #fff0;

  &:nth-of-type(2n) {
    --row-color: #f8f8f8;
    --row-transparent: #f8f8f800;
  }

  &[data-selected='true'] {
    --row-color: #cfe8fc;
    --row-transparent: #cfe8fc00;
  }
`

export const Table = styled.div<{ columns: number; expanded?: number }>`
  display: grid;
  box-sizing: border-box;
  grid-gap: var(--border-size);
  background-color: var(--border-color);
  grid-template-columns: var(--row-height) ${({ columns }) =>
      'auto '.repeat(columns)};

  /* stylelint-disable-next-line */
  ${({ columns }) =>
    Array(columns)
      .fill(0)
      .map(
        (_, i) => `
        &[data-expanded='${i}'] {
          grid-template-columns: var(--row-height) ${'auto '.repeat(
            i
          )}minmax(max-content, auto) ${'auto '.repeat(columns - i - 1)};
        }
      `
      )
      .join('\n')}
`

export const Wrap = styled.div<{ width: string; rows: number }>`
  --grid-width: ${({ width }) => width};
  --row-height: 2.8rem;
  --border-color: #90a4ae;
  --border-color-strong: #607d8b;
  --border-size: 1px;
  --cl-action-light: #1e88e5;
  --cl-action-dark: #0d47a1;
  --cell-padding: 0.8em;

  width: var(--grid-width);
  margin: auto;
  font-size: 0.85rem;
  box-shadow: 0 0 2px 1px #0005;
  border-radius: 0.15rem;
  user-select: none;
  background-color: #fff;

  input[type='checkbox'] {
    cursor: pointer;
  }

  &[data-view='fullscreen'] {
    --grid-width: 100vw;

    position: absolute;
    left: 0;
    top: 0;
    z-index: 2000;
  }
`

export const HeaderRow = styled(Row)`
  --row-color: #fff;
`

export const Select = styled(Cell)`
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;

  input {
    display: block;
    margin: 0;
  }
`

export const Header = styled(Cell)`
  font-weight: bold;
  text-transform: capitalize;

  &[data-sortdir='ASC'] {
    cursor: s-resize;
  }

  &[data-sortdir='DESC'] {
    cursor: n-resize;
  }

  svg {
    margin-left: auto;
    transform: scale(0.9);
    fill: var(--cl-action-dark);
  }
`

export const ContentCell = styled(Cell)`
  position: relative;
  padding-right: 0;
  overflow: hidden;

  &::after {
    content: '';
    width: var(--cell-padding);
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background: linear-gradient(
      to right,
      var(--row-transparent),
      var(--row-color)
    );
  }
`

export const Item = styled.span`
  white-space: nowrap;
  margin-right: var(--cell-padding);

  &[data-column='role'] {
    text-transform: lowercase;
  }
`

export const LoadingPlaceholder = styled.div<{ rows: number }>`
  & > div {
    display: block;
    width: 100%;
    height: var(--row-height);
    opacity: 0;
    animation: fade 2s linear 0s infinite;

    &:nth-of-type(2n) {
      background-color: #dceffd;
    }

    &:nth-of-type(2n + 1) {
      background-color: #cfe8fc;
    }

    /* stylelint-disable-next-line */
    ${({ rows }) =>
      Array(rows)
        .fill(0)
        .map(
          (_, i) => `
              &:nth-of-type(${i + 1}n) {
                animation-delay: ${(i / (rows * 3)) * 2}s;
              }`
        )
        .join('\n')}
  }

  @keyframes fade {
    0%,
    20% {
      opacity: 0;
    }

    10% {
      opacity: 0.8;
    }
  }
`

export const ControlStrip = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding-right: 1rem;
  flex-wrap: wrap;

  & > * {
    height: 3.5rem;
  }

  --border: calc(3 * var(--border-size)) solid var(--border-color);

  border-bottom: var(--border);

  /* stylelint-disable-next-line */
  ${Table} ~ & {
    border-top: var(--border);
    border-bottom: none;
  }

  ${PaginationInterface.sc} {
    margin-left: auto;
  }
`

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1em;
  border-right: var(--border-size) solid var(--border-color);
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  min-width: calc(var(--row-height) + 1px);

  svg {
    margin-left: auto;
    transform: scale(0.8);
    fill: var(--cl-action-dark);

    * ~ & {
      padding-left: 0.5rem;
    }
  }
`

export const Dropdown = styled.div`
  display: none;
  position: absolute;
  left: 0;
  top: 100%;
  box-shadow: 0 0 2px 1px #0005;
  background: #fff;
  z-index: 10;

  *[aria-expanded='true'] > & {
    display: block;
  }
`

export const Customize = styled.div`
  padding: 1rem;

  * {
    white-space: nowrap;
  }

  h4 {
    margin-top: 0;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
    display: flex;
    align-items: center;

    input {
      margin: 0;
    }

    label {
      margin-left: 0.5rem;
    }
  }
`

export const ViewToggle = styled.div`
  display: contents;

  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: scale(1) translateX(-50%) translateY(-50%);
  }
`

export const SearchWrap = styled.div`
  display: block;
  position: relative;
  margin-left: 1rem;

  --collapsed-size: 15em;

  flex: 1 0 var(--collapsed-size);
`

export const SearchBar = styled.form`
  display: flex;
  align-items: center;
  height: 2rem;
  border: 1px solid var(--border-color-strong);
  border-radius: 0.25em;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding-left: 0.5em;
  box-sizing: border-box;
  width: 100%;

  --transition-time: 0.2s;

  transition: border-color var(--transition-time) ease;

  svg {
    width: 1em;
    height: 1em;
    margin-right: 0.3em;
    fill: var(--border-color-strong);
    transition: fill var(--transition-time) ease;
    cursor: pointer;
  }

  &::after {
    content: '';
    background: #fff;
    position: absolute;
    right: -2px;
    top: -2px;
    height: calc(100% + 4px);
    width: calc(100% - var(--collapsed-size) + 0.5em);
    transform-origin: right;
    transition: transform var(--transition-time) ease, opacity 0s 0.05s;
  }

  &::before {
    content: '';
    position: absolute;
    right: calc(100% - var(--collapsed-size) - 1px);
    top: -1px;
    height: 100%;
    width: 1rem;
    z-index: 2;
    border: 1px solid;
    border-color: inherit;
    border-left: none;
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
    transition: right var(--transition-time) ease, opacity 0s 0s;
  }

  &[data-focus='true']::after {
    transform: scaleX(0);
    opacity: 0;
    transition: transform var(--transition-time) ease,
      opacity 0s var(--transition-time);
  }

  &[data-focus='true']::before {
    right: 0;
    opacity: 0;
    transition: right var(--transition-time) ease,
      opacity 0s var(--transition-time);
  }

  &[data-focus='true'] {
    border-color: var(--cl-action-dark);
  }

  &[data-focus='true'] svg {
    fill: var(--cl-action-dark);
  }
`

export const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  border-radius: inherit;
  font-family: inherit;
  font-size: 1em;
  color: var(--cl-text-strong);

  &:focus {
    outline: none;
  }
`
