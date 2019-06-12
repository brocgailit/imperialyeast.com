const https = require('https')
const { ALGOLIA_KEY, ALGOLIA_ID } = process.env

exports.handler = async (event, context) => {
  const data = JSON.stringify({
    query: event.queryStringParameters.query,
    type: 'city'
  })
  const options = {
    host: 'places-dsn.algolia.net',
    port: 443,
    path: '/1/places/query',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'X-Algolia-Application-Id': ALGOLIA_ID,
      'X-Algolia-API-Key:': ALGOLIA_KEY
    }
  }

  return new Promise((resolve, reject) => {
    let body
    const req = https
      .request(options, res => {
        res.setEncoding('utf8')
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(
            new Error(
              `${res.statusCode}: ${res.req.getHeader('host')} ${res.req.path}`
            )
          )
        }
        res.on('data', chunk => {
          body += chunk
        })
        res.on('end', () => {
          resolve(JSON.parse(body))
        })
      })
      .on('error', e => {
        reject(Error(e))
      })
    req.write(data)
    req.end()
  })
}
