export default function({ $axios }) {
  $axios.onRequest(config => {
    if (!config.url.startsWith('http')) {
      config.headers.common.Authorization = `Bearer ${
        process.env.COCKPIT_TOKEN
      }`
    }
  })
}
