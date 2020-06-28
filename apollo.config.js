const fs = require('fs')

const env = process.env.SCHEMA_TAG
  ? process.env
  : fs.existsSync('.env')
  ? Object.fromEntries(
      fs
        .readFileSync('.env', 'utf-8')
        .split('\n')
        .map(v => v.split('='))
    )
  : {}

const service =
  env.LOCAL_SCHEMA === 'true'
    ? `upframe@local-${require('os').userInfo().username}`
    : `upframe@${env.SCHEMA_TAG || 'beta'}`

console.log(`load schema version ${service}`)

module.exports = {
  client: {
    service,
  },
}
