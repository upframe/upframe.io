const fs = require('fs')

const env = fs.existsSync('.env')
  ? Object.fromEntries(
      fs
        .readFileSync('.env', 'utf-8')
        .split('\n')
        .map(v => v.split('='))
    )
  : {}

module.exports = {
  client: {
    service:
      env.LOCAL_SCHEMA === 'true'
        ? `upframe@local-${require('os').userInfo().username}`
        : `upframe@${env.SCHEMA_TAG || 'beta'}`,
  },
}
