<template>
  <section class="beer-styles-page">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains/"
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
        <li v-for="style of styles" :key="style._id">
          <nuxt-link
            :to="'/organic-yeast-strains/beer-styles/' + style.name_slug"
          >
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
          item: `${this.website.canonicalURL}/organic-yeast-strains`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Beer Styles',
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios }) {
    const styles = await $axios.$post('/collections/get/beerStyles', {
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
    })
    return { styles }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: this.website.canonicalURL + this.$route.path + '/'
        }
      ],
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
          content: `${this.website.canonicalURL}${this.$route.path}`
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
        /* {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.website.default_sharing_image.data.url
        }, */
        /* {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.website.default_sharing_image.title
        }, */
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
          content:
            'Imperial Yeast provides strains for all varieties of beer styles.'
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: 'Beer Styles'
        }
        /* {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.website.default_sharing_image.data.url
        } */
      ]
    }
  }
}
</script>
