import { stringify } from 'querystring'
import Vue from 'vue'

function asset(path, options) {
  return `${process.env.COCKPIT_CDN}/assets${path}?${stringify(options)}`
}

Vue.filter('asset', asset)
