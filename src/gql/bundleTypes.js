const fs = require('fs')

const typeDir = __dirname + '/types'

let schema = fs.readFileSync(`${typeDir}/schema.ts`, 'utf-8')

schema
  .match(/export\s(?:type|enum)\s\w+/g)
  .map(v => v.split(' ').pop())
  .forEach(file => {
    if (fs.existsSync(`${typeDir}/${file}.ts`))
      fs.unlinkSync(`${typeDir}/${file}.ts`)
  })

schema
  .match(/enum[^}]+\}/gs)
  .map(v => [
    v.match(/enum\s(\w+)/)[1],
    v.match(/(?<=\s*')([^']+)/g).filter((_, i) => !(i % 2)),
    v,
  ])
  .forEach(([name, values, match]) => {
    schema = schema.replace(
      match,
      `type ${name} = ${values.map(v => `'${v}'`).join(' | ')}`
    )
  })

fs.writeFileSync(`${typeDir}/schema.ts`, schema)

fs.writeFileSync(
  `${typeDir}/index.ts`,
  fs
    .readdirSync(typeDir)
    .filter(v => !/globalTypes/.test(v) && /\.ts$/.test(v))
    .map(file => `export * from './${file.split('.').slice(0, -1).join('.')}'`)
    .join('\n')
)
