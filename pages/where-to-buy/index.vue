<template>
  <section class="location-search-container container">
    <div class="location-search">
      <b-field
        class="location-search-input"
        custom-class="is-small"
        label="Find a homebrew yeast retailer near you:"
      >
        <b-autocomplete
          v-model="search"
          :data="searchResults"
          placeholder="Search by City or Zip"
          field="locale_names[0]"
          :loading="loadingSearchResults"
          @typing="handleSearchInput"
          @select="option => (location = option)"
        >
          <template slot-scope="props">
            {{ props.option.locale_names[0] }},
            {{ props.option.administrative[0] }}
          </template>
          <template slot="empty">
            No results for {{ search }}
          </template>
        </b-autocomplete>
      </b-field>
      <p v-if="location" class="retailer-counts">
        {{
          !(retailersNearLocation && retailersNearLocation.length)
            ? 'There are no '
            : 'Showing ' + retailersNearLocation.length
        }}
        retailers within {{ this.radius }} miles of
        <strong
          >{{
            (location.city ? location.city[0] : null) ||
              location.locale_names[0]
          }}, {{ location.administrative[0] }}</strong
        >
      </p>
      <ul class="retailer-list">
        <li
          v-for="retailer of retailersNearLocation"
          :key="retailer.id"
          class="retailer"
          @click="selected = retailer.id"
        >
          <div class="retailer-name">
            <span class="retailer-distance">
              {{ retailer.distance | formatDistance }}
            </span>
            {{ retailer.name }}
          </div>
          <address class="retailer-address">
            {{ retailer.address }} &bull; {{ retailer.city }}
          </address>
        </li>
      </ul>
    </div>
    <div class="location-map">
      <location-map
        :markers="markers"
        :height="500"
        :zoom="zoom"
        :center="center"
        :selected="selected"
      />
    </div>
  </section>
</template>

<script>
import debounce from 'lodash/debounce'
import LocationMap from '~/components/Map.vue'

const distance = (a, b) => {
  if (a.lat === b.lat && a.lng === b.lng) return 0
  else {
    const radLatA = (Math.PI * a.lat) / 180
    const radLatB = (Math.PI * b.lat) / 180
    const theta = a.lng - b.lng
    const radTheta = (Math.PI * theta) / 180
    let dist =
      Math.sin(radLatA) * Math.sin(radLatB) +
      Math.cos(radLatA) * Math.cos(radLatB) * Math.cos(radTheta)
    if (dist > 1) dist = 1
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    return dist
  }
}

export default {
  components: {
    LocationMap
  },
  filters: {
    formatDistance(value) {
      return `${Math.round(value * 10) / 10} mi.`
    }
  },
  props: {
    locations: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: '',
      location: null,
      loadingSearchResults: false,
      searchResults: [],
      selected: null,
      radius: 50 // miles
    }
  },
  mounted() {
    this.getLocationByGeolocation()
  },
  methods: {
    handleSearchInput: debounce(async function(query) {
      this.loadingSearchResults = true
      const { data: location } = await this.$axios({
        url: 'functions/geocode',
        baseURL: '/.netlify/',
        params: {
          query
        }
      })
      this.loadingSearchResults = false
      this.searchResults = location.hits
    }, 300),
    getGeolocation() {
      const options = {
        enableHighAccuracy: false,
        timeout: Infinity,
        maximumAge: 1000 * 30
      }
      return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      )
    },
    async getLocationByGeolocation() {
      try {
        const { coords } = await this.getGeolocation()
        const aroundLatLng = `${coords.latitude},${coords.longitude}`
        const { data: location } = await this.$axios({
          url: 'functions/reverse-geocode',
          baseURL: '/.netlify/',
          params: {
            aroundLatLng
          }
        })
        console.log()
        this.location = location.hits[0]
      } catch (e) {
        console.warning(e)
      }
    }
  },
  computed: {
    zoom() {
      return this.center ? 11 : 3
    },
    center() {
      return this.location
        ? [this.location._geoloc.lat, this.location._geoloc.lng]
        : null
    },
    retailersNearLocation() {
      if (!this.locations || !this.location) return null
      return this.locations
        .filter(l => l.geolocation)
        .map(l =>
          Object.assign({}, l, {
            distance: distance(l.geolocation, this.location._geoloc)
          })
        )
        .filter(l => l.distance < this.radius)
        .sort((a, b) => {
          return a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0
        })
    },
    markers() {
      return (this.retailersNearLocation || this.locations).map(location => {
        const { name, address, city, geolocation, website } = location
        const { lat, lng } = geolocation || [0, 0]
        return {
          id: location.id,
          coords: [lat, lng],
          popup: {
            title: name,
            content: `
                <address>
                  ${address} &bull; ${city}
                </address>
                <a rel="noopener" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" class="button is-primary is-small">Directions</a>
                <a rel="noopener" target="_blank" href="${website}" class="button is-primary is-small">Website</a>
              `
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.location-search-container {
  display: flex;
  padding-bottom: $size-1;
  .location-search {
    position: relative;
    padding: 0 4px;
    flex: 0 0 350px;
    height: 500px;
    overflow-y: scroll;
    @include custom-scrollbar(8px, $primary);
    .location-search-input {
      background-color: $white;
      padding-bottom: 2px;
      position: sticky;
      top: 0;
      left: 0;
      z-index: 1070;
    }

    .retailer-counts {
      font-size: $size-6;
      padding: $size-5;
      text-align: center;
    }
  }
  .location-map {
    flex-grow: 1;
    width: 100%;
  }

  .retailer-list {
    .retailer {
      position: relative;
      padding: 8px 2rem 8px 8px;
      border-bottom: 1px solid $light;
      &:first-child {
        border-top: 1px solid $light;
      }
      cursor: pointer;
      .retailer-distance {
        font-size: $size-7;
        font-weight: $weight-normal;
        color: $grey;
        white-space: nowrap;
        float: right;
      }
      .retailer-name {
        font-size: $size-6;
        font-weight: $weight-bold;
      }
      .retailer-address {
        font-size: $size-7;
      }

      &:after {
        position: absolute;
        content: '›';
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 8px;
      }

      &:hover {
        background-color: $light;
      }
    }
  }
}
</style>
