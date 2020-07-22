import markdownIt from 'markdown-it'

const md = new markdownIt().enable('table')

const tableDefault =
  md.renderer.rules.table_open ??
  ((tokens, i, options, env, self) => self.renderToken(tokens, i, options))

md.renderer.rules.table_open = (tokens, i, options, env, self) => {
  tokens[i].attrPush([
    'style',
    `--columns: ${tokens.filter(({ type }) => type === 'th_open').length}`,
  ])
  return tableDefault(tokens, i, options, env, self)
}

export const render = (text: string) => md.render(text)
