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
      /* {
        rel: 'preconnect',
        href: '//stats.g.doubleclick.net',
        crossorigin: 'crossorigin'
      }, */
      /* {
        rel: 'preconnect',
        href: '//www.google-analytics.com',
        crossorigin: 'crossorigin'
      }, */
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
    { src: '~/plugins/axios-headers' },
    { src: '~/plugins/gravity-conversion' },
    { src: '~/plugins/imgix-asset' },
    { src: '~/plugins/layout-actions' },
    { src: '~/plugins/nuxt-jsonld' },
    { src: '~/plugins/responsive-image' },
    { src: '~/plugins/dynamic-button' },
    { src: '~/plugins/show-decimals' },
    { src: '~/plugins/social-sharing', ssr: true },
    { src: '~/plugins/v-lazy-image', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false },
    { src: '~/plugins/vue-observe-visibility', ssr: false }
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
      },
      {
        require: 'css-scroll-snap-polyfill',
        detect: () =>
          'scrollSnapAlign' in document.documentElement.style ||
          'webkitScrollSnapAlign' in document.documentElement.style ||
          'msScrollSnapAlign' in document.documentElement.style
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
    '@nuxtjs/style-resources',
    [
      '@nuxtjs/google-tag-manager',
      {
        id: process.env.GOOGLE_TAG_MANAGER_ID,
        pageTracking: true
      }
    ],
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
              'faFilePdf',
              'faDatabase',
              'faCartPlus',
              'faEnvelope',
              'faUser',
              'faPhoneOffice',
              'faPhone',
              'faBriefcase',
              'faExclamationCircle',
              'faSearch',
              'faTimes',
              'faSpinnerThird',
              'faCheck',
              'faArrowToBottom',
              'faChevronUp',
              'faChevronRight',
              'faChevronLeft',
              'faShippingFast',
              'faLocation',
              'faCommentAltLines',
              'faMinus',
              'faPlus',
              'faCertificate'
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
    'nuxt-buefy',
    '@nuxtjs/sitemap'
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
          } else {
            route.url = ''
          }
          return route
        })
    }
  },

  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.COCKPIT_URL + '/api/',
    credentials: false,
    proxy: process.env.NODE_ENV === 'development'
  },

  proxy: {
    '/singletons': process.env.COCKPIT_URL + '/api/',
    '/collections': process.env.COCKPIT_URL + '/api/',
    '/cockpit': process.env.COCKPIT_URL + '/api/',
    '/forms': process.env.COCKPIT_URL + '/api/',
    '/.netlify': 'http://localhost:9000'
  },

  /*
   ** Generate options
   */
  generate: {
    concurrency: 20,
    // fallback: true,
    routes: async function() {
      const baseURL = process.env.COCKPIT_URL + '/api/collections/get/'
      const strainsPath = '/organic-yeast-strains/'
      const pages = await axios
        .post(baseURL + 'pages', { simple: true, populate: 12, rspc: 1 })
        .then(res => res.data)
      const menus = await axios
        .post(baseURL + 'menus', {
          simple: true,
          populate: 6, // include subs
          rspc: 1,
          fields: {
            name: 1,
            items: 1,
            path: 1
          }
        })
        .then(res => res.data)
      const styles = await axios
        .post(baseURL + 'beerStyles', {
          simple: true,
          populate: 1,
          rspc: 1,
          fields: {
            name: 1,
            alternativeNames: 1,
            description: 1,
            bjcp: 1,
            name_slug: 1,
            _id: 1,
            category: 1
          }
        }) // TODO: filter published
        .then(res => res.data)
      const styleCategories = await axios
        .post(baseURL + 'beerCategories', {
          simple: true,
          rspc: true,
          fields: {
            name: true,
            name_slug: true,
            description: true
          }
        })
        .then(res => res.data)
      const types = await axios
        .post(baseURL + 'strainTypes', { simple: true, rspc: 1 })
        .then(res => res.data)
      const strains = await axios
        .post(baseURL + 'strains', {
          populate: 1,
          filter: {
            public: true
          },
          fields: {
            productCode: 1,
            gtin: 1,
            image: 1,
            name: 1,
            shortDescription: 1,
            fullDescription: 1,
            temperature: 1,
            alcoholTolerance: 1,
            species: 1,
            profiles: 1,
            compareTo: 1,
            price: 1,
            similar: 1,
            name_slug: 1,
            attenuation: 1,
            flocculation: 1,
            type: 1,
            consumer: 1,
            instock: 1
            /* styleBest: 1,
            styleGood: 1,
            styleBetter: 1 */
          },
          simple: true,
          rspc: 1
        })
        .then(res => res.data)
      return [
        ...menus
          .reduce((collection, menu) => {
            return [
              ...collection,
              ...menu.items.map(i => [i.value.page.name_slug]),
              ...menu.items.reduce((acc, i) => {
                return [
                  ...acc,
                  ...(i.value.submenus || []).map(sub => [
                    i.value.page.name_slug,
                    sub.value.page.name_slug
                  ])
                ]
              }, [])
            ]
          }, [])
          .map(page => ({
            route: `/${page.join('/')}`,
            payload: pages.find(p => p.name_slug === page[page.length - 1])
          })),
        ...styles.map(style => ({
          route: `${strainsPath}beer-styles/${style.category.name_slug}/${
            style.name_slug
          }`,
          payload: { style, strains }
        })),
        ...styleCategories.map(category => ({
          route: `${strainsPath}beer-styles/${category.name_slug}`,
          payload: styles
        })),
        ...types.map(type => ({
          route: `${strainsPath}yeast-types/${type.name_slug}`,
          payload: type
        })),
        ...strains.map(strain => ({
          route:
            `${strainsPath}yeast-types/${strain.type.name_slug}/` +
            strain.name_slug,
          payload: strain
        }))
      ]
    }
  },

  /*
   ** Environment Variables
   */
  env: {
    COCKPIT_URL: process.env.COCKPIT_URL,
    COCKPIT_TOKEN: process.env.COCKPIT_TOKEN,
    COCKPIT_CDN: process.env.COCKPIT_CDN,
    COCKPIT_ASSETS: process.env.COCKPIT_ASSETS
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
    html: {
      minify: {
        minifyJS: false,
        minifyCSS: false
      }
    },
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
