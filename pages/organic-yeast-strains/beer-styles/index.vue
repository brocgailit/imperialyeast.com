<template>
  <section class="beer-styles-page">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains"
            >Organic Yeast Strains</nuxt-link
          >
        </li>
        <li class="is-active">
          <nuxt-link
            to="/organic-yeast-strains/beer-styles/"
            aria-current="page"
            >Beer Styles</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <article>
      <ul>
        <li v-for="style of styles" :key="style.id">
          <nuxt-link :to="'/organic-yeast-strains/beer-styles/' + style.slug">
            {{ style.name }}
          </nuxt-link>
        </li>
      </ul>
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      website: state => state.website
    })
  },
  jsonld() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Organic Yeast Strains',
          item: `${this.website.canonical_url}/organic-yeast-strains`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Beer Styles',
          item: `${
            this.website.canonical_url
          }/organic-yeast-strains/beer-styles/`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios }) {
    const { data: styles } = await $axios.$get(
      `items/beer_styles?filter[status]=published&fields=*.*`
    )
    return { styles }
  },
  head() {
    return {
      title: `Beer Styles | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Imperial Yeast provides strains for all varieties of beer styles.'
        },
        {
          hid: 'open-graph-url',
          property: 'og:url',
          content: `${this.website.canonical_url}${this.$route.path}`
        },
        {
          hid: 'open-graph-type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'open-graph-description',
          property: 'og:description',
          content:
            'Imperial Yeast provides strains for all varieties of beer styles.'
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: 'Beer Styles'
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.website.default_sharing_image.data.url
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.website.default_sharing_image.title
        },
        {
          hid: 'twitter-card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter-site',
          property: 'twitter:site',
          content: `@${this.website.twitter_handle}`
        },
        {
          hid: 'twitter-description',
          property: 'twitter:description',
          content:
            'Imperial Yeast provides strains for all varieties of beer styles.'
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: 'Beer Styles'
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.website.default_sharing_image.data.url
        }
      ]
    }
  }
}
</script>
