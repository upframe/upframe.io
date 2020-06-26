const fs = require('fs')

const typeDir = __dirname + '/types'

fs.writeFileSync(
  `${typeDir}/index.ts`,
  fs
    .readdirSync(typeDir)
    .map(
      file =>
        `export * from './${file
          .split('.')
          .slice(0, -1)
          .join('.')}'`
    )
    .join('\n')
)
