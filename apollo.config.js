const fs = require('fs')

const localSchema = fs.existsSync('.env')
  ? Object.fromEntries(
      fs
        .readFileSync('.env', 'utf-8')
        .split('\n')
        .map(v => v.split('='))
    ).LOCAL_SCHEMA === 'true'
  : false

module.exports = {
  client: {
    service: localSchema
      ? `upframe@local-${require('os').userInfo().username}`
      : 'upframe@beta',
  },
}
