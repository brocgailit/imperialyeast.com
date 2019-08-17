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
import { search } from '~/assets/script/search'
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
    this.searchTerm = q
    this.results = this.results = await this.search(q)
    this.loading = false
  },
  methods: {
    search
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: this.website.canonicalURL + this.$route.path + '/'
        }
      ],
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
            'Search the Imperial Yeast website for homebrewing information, yeast strains, purchase locations, and more.'
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: 'Search for Yeast Strains'
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
            'Search the Imperial Yeast website for homebrewing information, yeast strains, purchase locations, and more.'
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: 'Search for Yeast Strains'
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

<style lang="scss">
.search-results-section {
  padding: $size-1 $size-7;
  header {
    color: $black;
    text-align: center;
    h1 {
      font-size: $size-1;
      @include brand-font;
    }
    h2 {
      text-transform: uppercase;
      font-size: $size-4;
    }
  }
}
</style>
