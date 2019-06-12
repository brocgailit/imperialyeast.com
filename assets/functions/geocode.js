const axios = require('axios')
const { ALGOLIA_KEY, ALGOLIA_ID } = process.env

exports.handler = async (event, context) => {
  const data = {
    query: event.queryStringParameters.query,
    type: 'city'
  }

  return axios.post(`https://places-dsn.algolia.net/1/places/query`, data, {
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-Application-Id': ALGOLIA_ID,
      'X-Algolia-API-Key': ALGOLIA_KEY
    }
  })
}
