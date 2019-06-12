<template>
  <section>
    <b-field>
      <b-input
        v-model="search"
        type="search"
        icon="search"
        @input="handleSearchInput"
      ></b-input>
    </b-field>
    <div class="purchasing container">
      <location-map :markers="markers" :height="400" :zoom="3" />
    </div>
  </section>
</template>

<script>
import debounce from 'lodash/debounce'
import LocationMap from '~/components/Map.vue'
export default {
  components: {
    LocationMap
  },
  props: {
    locations: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: ''
    }
  },
  methods: {
    handleSearchInput: debounce(function(event) {
      this.handleSearch(this.search)
    }, 300),
    handleSearch(query) {
      this.$axios({
        url: 'functions/geocode',
        baseURL: '/.netlify/',
        params: {
          query
        }
      })
    }
  },
  computed: {
    markers() {
      return this.locations.map((location, index) => {
        const { name, address, geolocation } = location
        const { lat, lng } = geolocation || [0, 0]
        return {
          id: index,
          coords: [lat, lng],
          popup: {
            title: name,
            content: `
                <address>
                  ${address}
                </address>
                <div class="body" style="opacity: 0.85">
                  Stuff!
                </div>
                <a rel="noopener" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" style="text-decoration: none;">Directions</a>
              `
          }
        }
      })
    }
  }
}
</script>
