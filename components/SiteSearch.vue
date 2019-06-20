<template>
  <transition name="fade">
    <div v-show="active" class="site-search">
      <fa-icon :icon="['fal', 'search']" size="lg" class="search-icon" />
      <input
        ref="searchInput"
        :value="search"
        type="text"
        class="site-search-input"
        placeholder="Search for strains &amp; more …"
        @input="search = $event.target.value"
        @keyup="handleInput"
      />
      <button class="search-toggle" type="button" @click="close">
        <fa-icon
          :icon="['fal', loading ? 'spinner-third' : 'times']"
          size="lg"
          :class="{ 'spin-faster': loading }"
          :spin="loading"
        />
      </button>
      <transition name="slide-down">
        <div v-if="nothingFound" class="results">
          <span
            >No results were found for
            <strong>&ldquo;{{ this.search }}&rdquo;</strong>.</span
          >
        </div>
        <ul v-if="hasSomeResults" class="results" @click="close">
          <li v-if="results.strains && results.strains.length">
            <h3 class="result-type-name">Strains</h3>
            <ul>
              <li v-for="strain of results.strains" :key="strain.id">
                <h4>
                  <nuxt-link
                    :to="
                      '/organic-yeast-strains/yeast-types/' +
                        strain.strain_type.slug +
                        '/' +
                        strain.slug
                    "
                    >{{ strain.name }}</nuxt-link
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
                <h4>{{ location.name }}</h4>
                <address>
                  {{ location.address }}
                  {{ location.city }}, {{ location.state }}
                  {{ location.region }}
                </address>
              </li>
            </ul>
          </li>
          <li v-if="results.pages && results.pages.length">
            <h3 class="result-type-name">Pages</h3>
            <ul>
              <li v-for="page of results.pages" :key="page.id">
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
    </div>
  </transition>
</template>

<script>
import debounce from 'lodash/debounce'
import { search } from '~/assets/script/search'
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: '',
      loading: false,
      results: null
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
      return this.search && !this.loading && !this.hasSomeResults
    }
  },
  watch: {
    active(show) {
      if (show) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus()
        })
      } else {
        this.search = ''
        this.results = null
      }
    }
  },
  methods: {
    close() {
      this.$emit('change', false)
    },
    handleInput() {
      this.loading = true
      this.handleSearch()
    },
    handleSearch: debounce(async function() {
      this.loading = true
      if (this.search.length > 0) {
        try {
          this.results = await search.call(this, this.search, { limit: 3 })
          if (!this.search.length) {
            this.results = null
          }
        } catch (e) {
          this.results = null
        }
      } else {
        this.results = null
      }
      this.loading = false
    }, 400)
  }
}
</script>

<style lang="scss">
.site-search {
  .site-search-input,
  .search-icon,
  .search-toggle {
    position: absolute;
  }
  .site-search-input {
    font-size: $size-5;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: $white;
    box-shadow: none;
    border: 0;
    padding: 0 $size-1;
    &,
    &:focus {
      outline: 0;
    }
  }
  .search-icon {
    left: 0;
  }
  .search-toggle {
    right: 0;
  }
  .search-icon,
  .search-toggle {
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
  }
  .results {
    padding: $size-5;
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    z-index: -1;
    background-color: $white;
    border: 1px solid $light;
    box-shadow: 2px 2px 7px rgba($dark, 0.25);
    @include desktop {
      top: calc(100% + 1px);
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

  @include mobile {
    border-bottom: 1px solid $light;
    .site-search-input {
      font-size: 16px;
      padding-right: $size-1;
    }
    .search-icon {
      margin-left: $size-7;
    }
    .search-toggle {
      margin-right: $size-7;
    }
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: 350ms ease-in-out;
  transform: translateY(0);
}
.slide-down-enter,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-25px);
}

.spin-faster {
  animation: fa-spin 450ms infinite linear;
}
</style>
