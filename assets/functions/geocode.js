const axios = require('axios')
const { ALGOLIA_KEY, ALGOLIA_ID } = process.env

exports.handler = async (event, context) => {
  const data = {
    query: event.queryStringParameters.query,
    type: 'city',
    language: 'en'
  }

  try {
    const { data: geocode } = await axios.post(
      `https://places-dsn.algolia.net/1/places/query`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Algolia-Application-Id': ALGOLIA_ID,
          'X-Algolia-API-Key': ALGOLIA_KEY
        }
      }
    )
    return {
      statusCode: 200,
      body: JSON.stringify(geocode)
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: { message: err.message } })
    }
  }
}
