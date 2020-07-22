import markdownIt from 'markdown-it'

const md = new markdownIt()

export const render = (text: string) => md.render(text)
