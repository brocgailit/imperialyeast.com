<template>
  <section class="search-results-section">
    <header class="container">
      <h1>Search Results</h1>
      <h2 v-if="results">
        for &ldquo;<strong>{{ searchTerm }}</strong
        >&rdquo;
      </h2>
      <div v-else>
        Loading...
      </div>
    </header>
    <!-- Results -->
    <site-search-results
      :term="searchTerm"
      :results="results"
      class="container"
      :loading="loading"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import SiteSearchResults from '~/components/SiteSearchResults.vue'
export default {
  components: {
    SiteSearchResults
  },
  watchQuery: ['q'],
  computed: {
    ...mapState({
      website: state => state.website
    })
  },
  data() {
    return {
      searchTerm: '',
      results: null,
      loading: false
    }
  },
  async mounted() {
    const { q } = this.$route.query

    this.loading = true

    const createFilterString = fields =>
      fields
        .map((f, i) => `filter[${f}][logical]=or&filter[${f}][contains]=${q}`)
        .join('&')

    // search strains
    const strainFilters = createFilterString([
      'name',
      'short_description',
      'full_description',
      'compare_to'
    ])

    const strains = await this.$axios
      .$get(`items/strains?${strainFilters}&filter[status]=published`)
      .then(res => res.data)

    // search locations
    const locationFilters = createFilterString([
      'name',
      'city',
      'state',
      'postal_code',
      'phone'
    ])
    const locations = await this.$axios
      .$get(
        `items/purchase_locations?${locationFilters}&filter[status]=published`
      )
      .then(res => res.data)

    // search pages
    const pageFilters = createFilterString(['name', 'layouts.body'])
    const pages = await this.$axios
      .$get(
        `items/pages?fields=*.*,layouts.*&${pageFilters}&filter[status]=published`
      )
      .then(res => res.data)

    this.searchTerm = q
    this.results = { strains, pages, locations }
    this.loading = false
  },
  head() {
    return {
      title: `Search for Yeast Strains | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Search the Imperial Yeast website for homebrewing information, yeast strains, purchase locations, and more.'
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
            'Search the Imperial Yeast website for homebrewing information, yeast strains, purchase locations, and more.'
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: 'Search for Yeast Strains'
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
            'Search the Imperial Yeast website for homebrewing information, yeast strains, purchase locations, and more.'
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: 'Search for Yeast Strains'
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

<style lang="scss">
.search-results-section {
  padding: $size-1 $size-7;
  header {
    text-align: center;
    h1 {
      font-size: $size-1;
      font-family: $family-heading;
    }
    h2 {
      text-transform: uppercase;
      font-size: $size-4;
    }
  }
}
</style>
