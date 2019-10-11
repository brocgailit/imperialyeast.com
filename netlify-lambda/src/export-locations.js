const axios = require('axios')
const uniqid = require('uniqid')

const $axios = axios.create({
  baseURL: 'https://content.imperialyeast.com/_/'
})

exports.handler = async (event, context) => {
  const formatLocation = function(acc, location) {
    const {
      id,
      name,
      website,
      address,
      city,
      state,
      region,
      postal_code,
      country,
      geolocation,
      online_retailer,
      phone
    } = location
    return id + ',"' + (
      JSON.stringify({
        _mby: '5d33aae03335363d5f00023f',
        _by: '5d33aae03335363d5f00023f',
        _modified: 1565050082,
        _created: 1565050082,
        _id: uniqid('import'),
        type: 'Store',
        name: name,
        url: website,
        address: {
          streetAddress: address,
          addressLocality: city,
          addressRegion: state || region,
          postalCode: postal_code,
          addressCountry: country
        },
        geo: {
          lat: geolocation.lat,
          lng: geolocation.lng,
          address: `${address}, ${city}, ${state} ${postal_code} ${country}`
        },
        contactPoints: [
          {
            value: {
              telephone: phone,
              contactType: 'customer service',
              areaServed: state || country,
              availableLanguage: state ? ['English'] : []
            }
          }
        ],
        areaServed: state || country,
        telephone: phone,
        onlineRetailer: online_retailer
      }, null, 0).replace(/"/g, '""').replace(/\//g, '\\/')
    ) + '"\r\n' + acc
  }
  try {
    const { data: locations } = await $axios
      .get(
        `/items/purchase_locations?fields=*.*&filter[status]=published&limit=1000`
      )
      .then(res => res.data)

    return {
      statusCode: 200,
      headers: { 'content-type': 'text/csv' },
      body: `id,document\r\n${locations.reduce(formatLocation)}`
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: { message: err.message } })
    }
  }
}
