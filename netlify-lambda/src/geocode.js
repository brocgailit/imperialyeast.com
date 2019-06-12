const axios = require('axios')
const { ALGOLIA_KEY, ALGOLIA_ID } = process.env

const $axios = axios.create({
  baseURL: 'https://places-dsn.algolia.net/1/places/',
  headers: {
    'X-Algolia-Application-Id': ALGOLIA_ID,
    'X-Algolia-API-Key': ALGOLIA_KEY
  },
  withCredentials: true
})

exports.handler = async (event, context) => {
  const data = {
    query: event.queryStringParameters.query,
    type: 'city',
    countries: 'us,jp,au,dk,it,ie,fi,de,mx,nl,nz,no,pl,se,gb',
    language: 'en'
  }

  try {
    const { data: geocode } = await $axios.post('query', data)
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
