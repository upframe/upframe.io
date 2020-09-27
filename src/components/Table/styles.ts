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
  --cl-accent: var(--cl-action-dark);

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

  &[data-menu='actions'] {
    background-color: var(--cl-action-light);
    color: #fff;

    svg {
      fill: #fff;
    }

    * {
      border: none;
    }
  }
`

export const BatchActions = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1em;

  & > span {
    margin-right: auto;
  }

  button {
    margin-left: 1rem;
    font-weight: bold;
  }
`

export const ActionButton = styled.button`
  appearance: none;
  display: block;
  height: 100%;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 1em;
  color: inherit;

  &:focus {
    outline: none;
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
