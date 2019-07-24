const axios = require('axios')
const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preload',
        href: '/fonts/Alternate_Gothic_No1_D_Regular.woff2',
        type: 'font/woff2',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/montserrat-v13-latin-regular.woff2',
        type: 'font/woff2',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/montserrat-v13-latin-700.woff2',
        type: 'font/woff2',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/montserrat-v13-latin-900.woff2',
        type: 'font/woff2',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preconnect',
        href: '//stats.g.doubleclick.net',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preconnect',
        href: '//www.google-analytics.com',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preconnect',
        href: '//content.imperialyeast.com',
        crossorigin: 'crossorigin'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/Loading.vue',

  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/fonts.css',
    '@/assets/scss/framework.scss',
    '@/assets/scss/main.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/social-sharing', ssr: true },
    { src: '~/plugins/nuxt-jsonld' },
    { src: '~/plugins/layout-actions' },
    { src: '~/plugins/responsive-image' },
    { src: '~/plugins/v-lazy-image', ssr: false },
    { src: '~/plugins/vue-observe-visibility', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false },
    { src: '~/plugins/gravity-conversion' }
    // { src: '~/plugins/buefy' }
  ],

  /*
   ** Polyfills
   */
  polyfill: {
    features: [
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      },
      {
        require: 'smoothscroll-polyfill',
        detect: () =>
          'scrollBehavior' in document.documentElement.style &&
          window.__forceSmoothScrollPolyfill__ !== true,
        install: smoothscroll => smoothscroll.polyfill()
      }
    ]
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    '@nuxtjs/style-resources',
    [
      '@nuxtjs/google-tag-manager',
      {
        id: process.env.GOOGLE_TAG_MANAGER_ID,
        pageTracking: true
      }
    ],
    // 'nuxt-buefy',
    [
      'nuxt-fontawesome',
      {
        component: 'fa-icon',
        imports: [
          {
            set: '@fortawesome/pro-light-svg-icons',
            icons: [
              'faArrowUp',
              'faFlask',
              'faDatabase',
              'faCartPlus',
              'faEnvelope',
              'faUser',
              'faPhoneOffice',
              'faMobileAlt',
              'faBriefcase',
              'faExclamationCircle',
              'faSearch',
              'faTimes',
              'faSpinnerThird',
              'faCheck',
              'faArrowToBottom',
              'faChevronUp',
              'faChevronRight',
              'faShippingFast',
              'faLocation',
              'faCommentAltLines',
              'faMinus',
              'faPlus'
            ]
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: [
              'faFacebook',
              'faTwitter',
              'faLinkedin',
              'faInstagram',
              'faYoutube',
              'faReddit'
            ]
          }
        ]
      }
    ],
    'nuxt-polyfill',
    'nuxt-buefy'
  ],

  /*
   ** Buefy Options
   */
  buefy: {
    css: false,
    materialDesignIcons: false,
    defaultIconComponent: 'fa-icon',
    defaultIconPack: 'fal'
  },

  /*
   ** Style Resources
   */
  styleResources: {
    scss: ['@/assets/scss/component.scss']
  },

  /*
   ** Sitemap config
   */
  sitemap: {
    hostname: 'https://www.imperialyeast.com',
    gzip: true,
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date(),
      lastmodrealtime: true
    },
    filter({ routes }) {
      const filters = ['/home', '/resources']
      return routes
        .filter(route => filters.every(f => f !== route.url))
        .map(route => {
          if (route.url !== '/') {
            route.url = `${route.url}/`
            return route.url
          } else {
            return ''
          }
        })
    }
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.DIRECTUS_URL + '/_/',
    credentials: false,
    proxy: process.env.NODE_ENV === 'development'
  },

  proxy: {
    '/items': process.env.DIRECTUS_URL + '/_/',
    '/.netlify': 'http://localhost:9000'
  },

  /*
   ** Generate options
   */
  generate: {
    routes: async function() {
      const pages = await axios
        .get(process.env.DIRECTUS_URL + '/_/items/pages?filter[status]=published')
        .then(res => res.data.data)
      const styles = await axios
        .get(process.env.DIRECTUS_URL + '/_/items/beer_styles?filter[status]=published')
        .then(res => res.data.data)
      const types = await axios
        .get(process.env.DIRECTUS_URL + '/_/items/strain_types?filter[status]=published')
        .then(res => res.data.data)
      const strains = await axios
        .get(process.env.DIRECTUS_URL + '/_/items/strains?filter[status]=published&fields=*.*')
        .then(res => res.data.data)
      return [
        ...pages.map(page => `/${page.slug}`),
        ...styles.map(style => `/organic-yeast-strains/beer-styles/${style.slug}`),
        ...types.map(type => `/organic-yeast-strains/yeast-types/${type.slug}`),
        ...strains.map(strain => `/organic-yeast-strains/yeast-types/${strain.strain_type.slug}/${strain.slug}`)
      ]
    }
  },

  /*
   ** Environment Variables
   */
  env: {
    DIRECTUS_URL: process.env.DIRECTUS_URL
  },

  /*
   ** Render configuration
   */
  render: {
    resourceHints: false
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
