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
  }
}
</script>
