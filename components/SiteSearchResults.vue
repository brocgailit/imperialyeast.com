<template>
  <transition :name="transition">
    <div v-if="nothingFound" class="site-search-results no-results">
      <span
        >No results were found for
        <strong>&ldquo;{{ this.term }}&rdquo;</strong>.</span
      >
    </div>
    <ul v-if="hasSomeResults" class="site-search-results">
      <li v-if="results.strains && results.strains.length">
        <h3 class="result-type-name">Strains</h3>
        <ul>
          <li
            v-for="strain of results.strains"
            :key="strain.id"
            @click="
              $router.push(
                '/organic-yeast-strains/yeast-types/' +
                  strain.strain_type.slug +
                  '/' +
                  strain.slug
              )
            "
          >
            <h4>
              <nuxt-link
                :to="
                  '/organic-yeast-strains/yeast-types/' +
                    strain.strain_type.slug +
                    '/' +
                    strain.slug
                "
                >{{ strain.product_code }} {{ strain.name }}</nuxt-link
              >
            </h4>
            <p>{{ strain.short_description }}</p>
          </li>
        </ul>
      </li>
      <li v-if="results.locations && results.locations.length">
        <h3 class="result-type-name">Where to Buy</h3>
        <ul>
          <li v-for="location of results.locations" :key="location.id">
            <h4>
              <a :href="location.website" rel="noopener" target="_blank">{{
                location.name
              }}</a>
            </h4>
            <address>
              {{ location.address }}
              <span v-if="city">{{ location.city }}, {{ location.state }}</span>
              {{ location.region }}
            </address>
          </li>
        </ul>
      </li>
      <li v-if="results.pages && results.pages.length">
        <h3 class="result-type-name">Pages</h3>
        <ul>
          <li
            v-for="page of results.pages"
            :key="page.id"
            @click="$router.push('/' + page.slug)"
          >
            <h4>
              <nuxt-link :to="'/' + page.slug">
                {{ page.name }}
              </nuxt-link>
            </h4>
            <p>{{ page.description }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </transition>
</template>

<script>
export default {
  props: {
    results: {
      type: Object,
      default: () => null
    },
    transition: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    term: {
      type: String,
      default: null
    }
  },
  computed: {
    hasSomeResults() {
      const { strains, locations, pages } = this.results || {}
      return (
        (strains && strains.length) ||
        (locations && locations.length) ||
        (pages && pages.length)
      )
    },
    nothingFound() {
      return this.term && !this.loading && !this.hasSomeResults
    }
  }
}
</script>

<style lang="scss">
.site-search-results {
  padding: $size-5;
  width: 100%;
  &.no-results {
    text-align: center;
  }
  @include desktop {
    display: flex;
    justify-content: space-around;
    > * {
      flex: 0 0 33%;
    }
  }

  h3 {
    font-size: $size-4;
    font-weight: $weight-black;
    text-transform: uppercase;
  }

  h4 {
    font-size: $size-5;
    font-weight: $weight-bold;
  }

  li {
    margin-bottom: $size-7;
  }
}
</style>
