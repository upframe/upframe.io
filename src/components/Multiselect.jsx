import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Input, Chip } from '.'
import Fuse from 'fuse.js'

export default function MultiSelect({ selection, onChange, options = [] }) {
  const [input, setInput] = useState('')
  const [fuse, setFuse] = useState()
  const [search, setSearch] = useState([])
  const [selected, setSelected] = useState()
  const listRef = useRef()
  const [lastScroll, setLastScroll] = useState(performance.now())

  useEffect(() => {
    setFuse(
      new Fuse(options, {
        includeMatches: true,
        threshold: 0.3,
        findAllMatches: true,
      })
    )
  }, [options])

  // search & highlight
  useEffect(() => {
    if (!fuse) return
    const res = fuse.search(input)
    setSearch(
      res.map(({ item, matches }) => {
        let indices =
          matches && matches.length
            ? matches[0].indices.map(([start, end]) => [start, end + 1])
            : []
        if (indices.length) {
          const maxDiff = Math.max(
            ...indices.map(([start, end]) => end - start)
          )
          indices = indices.filter(
            ([start, end]) => (end - start) / maxDiff >= 0.8
          )
        }
        if (indices.length === 0)
          return { value: item, formatted: <span>{item}</span> }
        const slices = [
          { index: [0, indices[0][0]], match: false },
          ...indices
            .slice(0, -1)
            .flatMap((slice, i) => [
              { index: [slice[0], slice[1]], match: true },
              { index: [slice[1], indices[i + 1][0]], match: false },
            ]),
          {
            index: indices.slice(-1)[0],
            match: true,
          },
          { index: [indices.slice(-1)[0][1]], match: false },
        ]

        const segs = slices
          .map(({ index: [start, end], match }) => ({
            match,
            seg: item.slice(start, end),
            key: item + start + end,
          }))
          .filter(({ seg }) => seg)

        return {
          value: item,
          formatted: (
            <>
              {segs.map(({ seg, match, key }) => {
                const Tag = match ? 'b' : 'span'
                return <Tag key={key}>{seg}</Tag>
              })}
            </>
          ),
        }
      })
    )
  }, [fuse, input])

  useEffect(() => {
    if (!search.length) return
    setSelected(search[0].value)
  }, [input, search])

  // keep selection in view
  useEffect(() => {
    if (!listRef || !listRef.current) return
    const index = search.findIndex(({ value }) => value === selected)
    const node = listRef.current.children[index]
    if (!node) return

    if (node.offsetTop < listRef.current.scrollTop) {
      listRef.current.scrollTop = node.offsetTop
      setLastScroll(performance.now())
    } else if (
      node.offsetTop + node.offsetHeight >
      listRef.current.scrollTop + listRef.current.offsetHeight
    ) {
      listRef.current.scrollTop =
        node.offsetTop + node.offsetHeight - listRef.current.offsetHeight
      setLastScroll(performance.now())
    }
  }, [selected, search])

  function addTag(tag) {
    if (tag) onChange(Array.from(new Set([...selection, tag.toLowerCase()])))
    setInput('')
  }

  function handleKey(e) {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault()
      addTag(selected ? selected : input)
    }
    if (e.key === 'Backspace') {
      if (input === '' && selection.length) onChange(selection.slice(0, -1))
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const focusIndex = search.findIndex(({ value }) => value === selected)
      setSelected(
        search[
          Math.min(
            Math.max(0, focusIndex + 1 * (e.key.endsWith('Down') ? 1 : -1)),
            search.length - 1
          )
        ].value
      )
    }
  }

  return (
    <S.Wrap>
      <S.Select onKeyDown={handleKey}>
        <Input onChange={setInput} value={input} />
        {selection
          .map(v => (
            <Chip
              key={v}
              onClick={() => onChange(selection.filter(s => s !== v))}
            >
              {v}
            </Chip>
          ))
          .reverse()}
      </S.Select>
      {input.length > 0 && (
        <S.List ref={listRef}>
          {search.map(({ value, formatted }) => (
            <li
              key={value}
              {...(value === selected && { 'data-selected': true })}
              onMouseEnter={() => {
                if (performance.now() - lastScroll > 100) setSelected(value)
              }}
              onClick={() => addTag(value)}
            >
              {formatted}
            </li>
          ))}
        </S.List>
      )}
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    position: relative;
  `,

  Select: styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding-left: 1rem;
    border-radius: 0.3rem;
    background-color: #f1f3f4;
    overflow-x: auto;

    input {
      flex-grow: 1;
      padding-left: 0;
    }

    & > div {
      margin-right: 0.5rem;
    }
  `,

  List: styled.ul`
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    margin-top: 0.5rem;
    background: #fff;
    box-shadow: 0px 1px 6px #0004;
    border-radius: 0.3rem;
    list-style: none;
    padding: 0;
    --item-height: 2.8rem;
    max-height: calc(5 * var(--item-height));
    overflow-y: auto;

    li {
      padding: 0 1rem;
      font-size: 1rem;
      line-height: var(--item-height);
      cursor: pointer;

      &[data-selected] {
        background-color: #feeef2;
      }
    }
  `,
}
