const https = require('https')
const { ALGOLIA_KEY, ALGOLIA_ID } = process.env

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

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
  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        res.on('data', resolve)
      })
      req.on('error', reject)
    })
    return {
      statusCode: 200,
      body: response
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: e.message
    }
  }
}
