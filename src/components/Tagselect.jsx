import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { TagInput } from '.'
import { useQuery, gql } from 'gql'

const TAG_SEARCH = gql`
  query TagSearch($input: String!) {
    search(term: $input, maxTags: 100) {
      tags {
        tag {
          id
          name
        }
        markup
      }
    }
  }
`

export default function TagSelect({ selection, onChange }) {
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState()
  const [newSelected, setNewSelected] = useState(false)
  const listRef = useRef()
  const [lastScroll, setLastScroll] = useState(performance.now())
  const [toDelete, setToDelete] = useState()

  const { data: { search: { tags = [] } = {} } = {} } = useQuery(TAG_SEARCH, {
    variables: { input },
  })

  useEffect(() => {
    if (!tags.length) {
      setSelected()
      setNewSelected(true)
    } else {
      setSelected(tags[0].tag.id)
      setNewSelected()
    }
  }, [input, tags])

  // keep selection in view
  useEffect(() => {
    if (!listRef || !listRef.current) return
    const index = tags.findIndex(({ tag }) => tag.id === selected)
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
  }, [selected, tags])

  function addTag(tag) {
    if (tag)
      onChange([
        ...selection,
        ...(!selection.find(
          ({ id, name }) =>
            id === tag.id || name.toLowerCase() === tag.name.toLowerCase()
        )
          ? [tag]
          : []),
      ])
    setInput('')
  }

  function handleKey(e) {
    if (e.key === 'Backspace') {
      if (input || !selection.length) return
      if (toDelete) {
        onChange(selection.slice(0, -1))
        setToDelete(null)
      } else setToDelete(selection.slice(-1)[0].id)
    } else setToDelete()
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault()
      addTag(
        selected
          ? tags.find(({ tag }) => tag.id === selected).tag
          : { name: input, id: input }
      )
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (tags.length === 0) return
      e.preventDefault()
      const focusIndex = newSelected
        ? tags.length
        : tags.findIndex(({ tag }) => tag.id === selected)

      const nextSelected = Math.max(
        0,
        focusIndex + 1 * (e.key.endsWith('Down') ? 1 : -1)
      )
      if (nextSelected < tags.length) {
        setSelected(
          tags[
            Math.min(
              Math.max(0, focusIndex + 1 * (e.key.endsWith('Down') ? 1 : -1)),
              tags.length - 1
            )
          ].tag.id
        )
        setNewSelected()
      } else {
        setSelected()
        setNewSelected(true)
      }
    }
  }

  return (
    <S.Wrap>
      <TagInput
        value={input}
        onChange={setInput}
        tags={selection}
        highlight={toDelete}
        onKeyDown={handleKey}
        onTagClick={id => onChange(selection.filter(tag => tag.id !== id))}
      />
      {input.length > 0 && (
        <S.List ref={listRef}>
          {tags.map(({ tag, markup }) => (
            <li
              key={tag.id}
              {...(tag.id === selected && { 'data-selected': true })}
              onMouseEnter={() => {
                if (performance.now() - lastScroll > 100) {
                  setSelected(tag.id)
                  setNewSelected()
                }
              }}
              onClick={() => addTag(tag)}
              dangerouslySetInnerHTML={{ __html: markup }}
            ></li>
          ))}
          {!tags
            .map(({ tag }) => tag.name.toLowerCase())
            .includes(input.toLowerCase()) && (
            <S.Add
              {...(newSelected && { 'data-selected': true })}
              onClick={() => addTag({ name: input, id: input })}
              onMouseEnter={() => {
                if (performance.now() - lastScroll > 100) {
                  setNewSelected(true)
                  setSelected()
                }
              }}
            >
              &lsquo;{input}&rsquo;
            </S.Add>
          )}
        </S.List>
      )}
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    position: relative;
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

  Add: styled.li`
    font-weight: bold;

    &:before {
      content: 'ADD ';
      color: #ff205c;
    }
  `,
}
