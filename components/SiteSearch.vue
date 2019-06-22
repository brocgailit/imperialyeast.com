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
      <site-search-results
        :term="search"
        :loading="loading"
        :results="results"
        transition="slide-down-search"
        @click.native="close"
      />
    </div>
  </transition>
</template>

<script>
import debounce from 'lodash/debounce'
import { search } from '~/assets/script/search'
import SiteSearchResults from '~/components/SiteSearchResults.vue'
export default {
  components: {
    SiteSearchResults
  },
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
          this.results = await search.call(this, this.search, { limit: 5 })
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
  .site-search-results {
    position: absolute;
    top: 50px;
    left: 0;
    box-shadow: 2px 2px 7px rgba($dark, 0.25);
    z-index: -1;
    background-color: $white;
    border: 1px solid $light;
    @include desktop {
      top: calc(100% + 1px);
    }
  }
}

.slide-down-search-enter-active,
.slide-down-search-leave-active {
  transition: 350ms ease-in-out;
  transform: translateY(0);
}
.slide-down-search-enter,
.slide-down-search-leave-to {
  opacity: 0;
  transform: translateY(-25px);
}

.spin-faster {
  animation: fa-spin 450ms infinite linear;
}
</style>
