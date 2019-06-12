<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
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
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import LocationMap from '~/components/Map.vue'
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'

export default {
  components: {
    LocationMap
  },
  data() {
    return {
      DYNAMIC_COMPONENTS,
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
  },
  async asyncData({ params, $axios }) {
    const slug = 'where-to-buy'
    const fields = [
      '*.*',
      'layouts.*.*',
      'layouts.forms.fields.*',
      'layouts.forms.*'
    ]
    const locations = await $axios
      .$get(`items/purchase_locations?filter[status]=published`)
      .then(res => res.data)
    const page = await $axios
      .$get(
        `items/pages?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)
    return { page, locations }
  }
}
</script>

<style lang="scss" scoped>
.strains {
  columns: 500px;
  column-gap: $size-7;
  text-align: center;
  padding-bottom: $size-1;
  .strain-group-name {
    font-weight: $weight-black;
    font-size: $size-3;
    text-transform: uppercase;
  }
  .strain-list {
    padding: 0 $size-4;
    break-inside: avoid;
    page-break-inside: avoid;
    .strain {
      margin: $size-7 0;
      .strain-name {
        font-weight: $weight-bold;
        font-size: $size-5;
      }
      .strain-description {
        font-size: $size-6;
        margin: $size-7 0;
      }
      .strain-detail-name,
      .strain-detail-info {
        display: inline;
        text-transform: uppercase;
        color: $grey;
        font-family: $family-heading;
      }

      .strain-detail-name:not(:first-child):before {
        content: '// ';
      }
    }
  }
}
</style>
