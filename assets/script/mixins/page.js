import { mapState } from 'vuex'
import { COMPONENTS } from '~/assets/script/components'

export default {
  data() {
    return {
      COMPONENTS
    }
  },
  computed: {
    ...mapState({
      website: state => state.website
    }),
    featuredImageURL() {
      return this.page && this.page.featuredImage
        ? `${process.env.COCKPIT_CDN}/assets${
            this.page.featuredImage.path
          }?q=75&w=1200&h=630&fit=crop`
        : ''
    }
  },
  head() {
    if (!this.page) return {}
    const canonical = `${this.website.canonicalURL}${
      this.$route.path && this.$route.path !== '/' ? this.$route.path + '/' : ''
    }`
    return {
      link: [
        {
          rel: 'canonical',
          href: canonical
        }
      ],
      title: `${this.page.title} | ${this.website.title}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description
        },
        {
          hid: 'open-graph-url',
          property: 'og:url',
          content: canonical
        },
        {
          hid: 'open-graph-type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'open-graph-description',
          property: 'og:description',
          content: this.page.description
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: this.page.title
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.featuredImageURL
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.page.featuredImage
            ? this.page.featuredImage.title
            : null
        },
        {
          hid: 'twitter-card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter-site',
          property: 'twitter:site',
          content: `@${this.website.twitter}`
        },
        {
          hid: 'twitter-description',
          property: 'twitter:description',
          content: this.page.description
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: this.page.title
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.featuredImageURL
        }
      ]
    }
  },
  async asyncData({ params, $axios, store, payload }) {
    if (payload) {
      return { page: payload }
    }
    const { slug } = params
    const options = {
      limit: 1,
      simple: true,
      populate: 12,
      rspc: 1,
      filter: {}
    }
    if (!slug) {
      options.filter._id = store.state.website.homepage._id
    } else {
      options.filter.name_slug = slug
    }

    const [page] = await $axios.$post(`collections/get/pages`, options)

    return { page }
  }
}
