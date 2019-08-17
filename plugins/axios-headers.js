export default function({ $axios }) {
  $axios.onRequest(config => {
    config.headers.common.Authorization = `Bearer ${process.env.COCKPIT_TOKEN}`
  })
}
