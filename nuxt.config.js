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
        href: '/fonts/oswald-v23-latin-regular.woff',
        type: 'font/woff',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/oswald-v23-latin-regular.woff2',
        type: 'font/woff2',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/oswald-v23-latin-500.woff',
        type: 'font/woff',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/oswald-v23-latin-500.woff2',
        type: 'font/woff2',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/montserrat-v13-latin-regular.woff',
        type: 'font/woff',
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
        href: '/fonts/montserrat-v13-latin-600.woff',
        type: 'font/woff',
        as: 'font',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: '/fonts/montserrat-v13-latin-600.woff2',
        type: 'font/woff2',
        as: 'font',
        crossorigin: 'crossorigin'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

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
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'nuxt-buefy',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/pro-light-svg-icons',
            icons: ['faArrowUp', 'faFlask', 'faDatabase', 'faCartPlus']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: [
              'faFacebook',
              // 'faTwitter',
              // 'faLinkedin',
              'faInstagram',
              'faYoutube'
            ]
          }
        ]
      }
    ],
    [
      'nuxt-netlify-http2-server-push',
      {
        // Specify relative path to the dist directory and its content type
        resources: [
          { path: '**/*.js', as: 'script' },
          // { path: 'images/hero.jpg', as: 'image' },
          { path: 'fonts/*.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
          // { path: 'images/bg-image-narrow.png', as: 'image', media: '(max-width: 600px)', },
        ]
      }
    ]
  ],

  /*
   ** Buefy Options
   */
  buefy: {
    css: false,
    materialDesignIcons: false
  },

  /*
   ** Style Resources
   */
  styleResources: {
    scss: ['@/assets/scss/component.scss']
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.DIRECTUS_URL,
    credentials: true
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
