import React from 'react'
import styled from 'styled-components'

interface Props {
  totalRows?: number
  rowLimit: number
  setRowLimit(n: number): void
  offset: number
  setOffset(n: number): void
}

const sequence = (from: number, to: number, step: number, inclusive = false) =>
  Array((to - from) / step + (inclusive ? 1 : 0))
    .fill(from)
    .map((n, i) => n + i * step)

const rowLimits = [
  ...sequence(5, 25, 5),
  ...sequence(25, 100, 25),
  ...sequence(100, 300, 50),
  ...sequence(300, 500, 100, true),
]

function PaginationInterface({
  totalRows,
  rowLimit,
  setRowLimit,
  offset = 0,
  setOffset,
}: Props) {
  function goToPage(page: number) {
    if (!totalRows) return
    setOffset(Math.max(0, Math.min((page - 1) * rowLimit, totalRows - 1)))
  }

  const pages = Math.ceil((totalRows ?? 1) / rowLimit)
  const current =
    offset < (totalRows ?? 1) - rowLimit ? ((offset / rowLimit) | 0) + 1 : pages

  return (
    <S.Wrap>
      <S.Item>
        <span>{totalRows ?? '?'} Results</span>
      </S.Item>
      <S.Item>
        <span>Show:</span>
        <select
          value={rowLimit}
          onChange={({ target }) =>
            setRowLimit(parseInt((target as HTMLSelectElement).value))
          }
        >
          {rowLimits.map(n => (
            <option key={`show-${n}`}>{n}</option>
          ))}
        </select>
      </S.Item>
      {(totalRows ?? 0) > rowLimit && (
        <S.Item>
          <Pages pages={pages} current={current} onPageChange={goToPage} />
        </S.Item>
      )}
      {pages > 5 && (
        <S.Item>
          <span>Jump to:</span>
          <select
            value={current}
            onChange={({ target }) => goToPage(parseInt(target.value))}
          >
            {Array(pages)
              .fill(0)
              .map((_, i) => (
                <option key={`page-${i}`}>{i + 1}</option>
              ))}
          </select>
        </S.Item>
      )}
    </S.Wrap>
  )
}

interface PageProps {
  pages: number
  current: number
  onPageChange(n: number): void
}

function Pages({ pages, current, onPageChange }: PageProps) {
  const num = (n: number) => (
    <span
      key={`page-${n}`}
      {...(n === current
        ? { 'data-active': true }
        : { role: 'button', onClick: () => onPageChange(n) })}
    >
      {n}
    </span>
  )
  let o = 0
  const omit = () => <span key={`omit-${o++}`}>{'  …  '}</span>
  const seq = (a: number, b: number) =>
    Array(b - a + 1)
      .fill(a)
      .flatMap((v, i, { length }) => [
        num(v + i),
        i < length - 1 && <span key={`space-${v + i}`}>{'  '}</span>,
      ])

  let content: any[] = []

  if (pages <= 5) content = seq(1, pages)
  else if (current <= 2 || current >= pages - 1) {
    content = [...seq(1, 2), omit(), ...seq(pages - 1, pages)]
  } else
    content = [
      num(1),
      omit(),
      ...seq(current - 1, current + 1),
      omit(),
      num(pages),
    ]

  return (
    <S.Pages>
      <span
        role="button"
        aria-disabled={current === 1}
        onClick={({ target }) => {
          if (
            (target as HTMLSpanElement).getAttribute('aria-disabled') === 'true'
          )
            return
          onPageChange(current - 1)
        }}
      >
        &lt;
      </span>
      {'  '}
      {content.filter(Boolean)}
      {'  '}
      <span
        role="button"
        aria-disabled={current === pages}
        onClick={({ target }) => {
          if (
            (target as HTMLSpanElement).getAttribute('aria-disabled') === 'true'
          )
            return
          onPageChange(current + 1)
        }}
      >
        &gt;
      </span>
    </S.Pages>
  )
}

const S = {
  Wrap: styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    flex-shrink: 0;
  `,

  Item: styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    margin-left: 1.5rem;

    select {
      margin-left: 1ch;
    }
  `,

  Pages: styled.pre`
    font-family: inherit;
    font-size: inherit;
    color: var(--cl-action-light);
    cursor: default;
    font-weight: bold;

    & > span[role='button'] {
      cursor: pointer;
    }

    & > span[data-active='true'] {
      color: var(--cl-action-dark);
    }

    & > span[aria-disabled] {
      font-weight: normal;
      font-size: 1.2em;
      display: inline-block;
      vertical-align: -4%;
    }

    & > span[aria-disabled='true'] {
      color: var(--cl-text-light);
      cursor: default;
    }
  `,
}

export default Object.assign(PaginationInterface, { sc: S.Wrap })
