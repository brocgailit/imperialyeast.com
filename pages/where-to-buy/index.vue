<template>
  <section class="location-search-container container">
    <div class="location-search">
      <label class="location-search-label" for="location-autocomplete">
        Find a homebrew yeast retailer near you.
      </label>
      <b-field class="location-search-input" custom-class="is-small">
        <b-autocomplete
          id="location-autocomplete"
          v-model="search"
          class="location-search-autocomplete"
          :data="searchResults"
          placeholder="Search by City or Zip"
          field="locale_names[0]"
          :loading="loadingSearchResults"
          expanded
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
        <div class="control">
          <b-button
            style="padding: 0 1em"
            type="is-primary"
            @click="getLocationByGeolocation"
          >
            <fa-icon :icon="['fal', 'location']" title="Get Geolocation" />
          </b-button>
        </div>
      </b-field>
      <p v-if="location" class="retailer-counts">
        {{
          !(retailersNearLocation && retailersNearLocation.length)
            ? 'There are no '
            : 'Showing ' + retailersNearLocation.length
        }}
        retailers within {{ radius }} miles of
        <strong
          >{{
            (location.city ? location.city[0] : null) ||
              location.locale_names[0]
          }}, {{ location.administrative[0] }}</strong
        >
      </p>
      <div v-if="location" class="retailer-list-actions">
        <b-button
          size="is-small"
          type="is-primary"
          outlined
          @click="clearLocation"
        >
          Clear Search
        </b-button>
      </div>
      <div class="view-actions">
        <b-field position="is-centered">
          <b-radio-button
            v-model="tab"
            size="is-small"
            native-value="retailer-list"
          >
            Location List
          </b-radio-button>
          <b-radio-button
            v-model="tab"
            size="is-small"
            native-value="location-map"
          >
            Map View
          </b-radio-button>
        </b-field>
      </div>
      <ul
        class="retailer-list"
        :class="{ 'is-visible': tab === 'retailer-list' }"
      >
        <li
          v-for="retailer of retailersNearLocation"
          :key="retailer._id"
          class="retailer"
          :class="{ 'is-selected': selected === retailer._id }"
          @click="selected = retailer._id"
        >
          <b-collapse
            :open="selected === retailer._id"
            :aria-id="'location-' + retailer._id"
          >
            <div
              slot="trigger"
              role="button"
              :aria-controls="'location-' + retailer._id"
            >
              <div class="retailer-name">
                <span class="retailer-distance">
                  {{ retailer.distance | formatDistance }}
                </span>
                {{ retailer.name }}
              </div>
              <address class="retailer-address">
                {{ retailer.address.streetAddress }} &bull;
                {{ retailer.address.addressLocality }}
              </address>
            </div>
            <div class="retailer-actions">
              <a
                rel="noopener"
                target="_blank"
                :href="
                  'https://www.google.com/maps/dir/?api=1&destination=' +
                    retailer.geo.lat +
                    ',' +
                    retailer.geo.lng
                "
                class="button is-primary is-small"
                >Directions</a
              >
              <a
                v-if="retailer.url"
                rel="noopener"
                target="_blank"
                :href="retailer.url"
                class="button is-primary is-small"
                >Website</a
              >
            </div>
          </b-collapse>
        </li>
      </ul>
    </div>
    <div class="location-map" :class="{ 'is-visible': tab === 'location-map' }">
      <map-loader
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
import MapLoader from '~/components/MapLoader.vue'

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
  name: 'WhereToBuyDetailPage',
  components: {
    MapLoader
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
      mapComponent: null,
      search: '',
      location: null,
      loadingSearchResults: false,
      searchResults: [],
      selected: null,
      radius: 50, // miles
      tab: 'location-map'
    }
  },
  computed: {
    zoom() {
      const zoom =
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 768px)').matches
          ? 3
          : 4
      return this.center && this.location ? 8 : zoom
    },
    center() {
      return this.location
        ? [this.location._geoloc.lat, this.location._geoloc.lng]
        : [39.5, -98.35]
    },
    retailersNearLocation() {
      if (!this.locations || !this.location) return null
      return this.locations
        .filter(l => l.geo)
        .map(l =>
          Object.assign({}, l, {
            distance: distance(l.geo, this.location._geoloc)
          })
        )
        .filter(l => l.distance < this.radius)
        .sort((a, b) => {
          return a.distance > b.distance ? 1 : a.distance < b.distance ? -1 : 0
        })
    },
    markers() {
      return (this.retailersNearLocation || this.locations).map(location => {
        const { name, address, geo, url } = location
        const { lat, lng } = geo || [0, 0]
        const { streetAddress, addressLocality } = address
        return {
          id: location._id,
          coords: [lat, lng],
          popup: {
            title: name,
            content: `
                <address>
                  ${streetAddress} &bull; ${addressLocality}
                </address>
                <a rel="noopener" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" class="button is-primary is-small">Directions</a>
                <a rel="noopener" target="_blank" href="${url}" class="button is-primary is-small">Website</a>
              `
          }
        }
      })
    }
  },
  mounted() {
    // this.getLocationByGeolocation()
    this.mapComponent = () => import('~/components/Map.vue')
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
      /* const options = {
        enableHighAccuracy: false,
        timeout: Infinity,
        maximumAge: 1000 * 30
      } */
      return new Promise((resolve, reject) =>
        // navigator.geolocation.getCurrentPosition(resolve, reject, options)
        navigator.geolocation.getCurrentPosition(resolve, reject)
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
        this.location = location.hits[0]
      } catch (e) {
        console.warn(e)
      }
    },
    clearLocation() {
      this.location = null
    }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/components/dropdown';
@import '~buefy/src/scss/components/_radio';
@import '~buefy/src/scss/components/_autocomplete';
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
      z-index: 2;
      /* .geolocate-button {
        position: absolute;
        right: 0;
      } */
    }

    .location-search-label {
      text-align: center;
      font-size: $size-7;
      display: block;
      font-weight: $weight-bold;
      padding-bottom: $size-7;
    }

    .placeholder-text {
      text-align: center;
      padding: $size-5;
      font-size: $size-5;
    }

    .retailer-counts {
      font-size: $size-7;
      padding: $size-5;
      text-align: center;
    }
    .retailer-list-actions {
      text-align: center;
      margin-bottom: $size-5;
    }
  }

  .view-actions {
    margin-bottom: $size-5;
    @include tablet {
      display: none;
    }
  }

  .location-map {
    @include mobile {
      &:not(.is-visible) {
        visibility: hidden;
        height: 0;
        overflow: visible;
      }
    }
    flex-grow: 1;
    width: 100%;
  }

  .retailer-list {
    @include mobile {
      &:not(.is-visible) {
        display: none;
      }
    }
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
        font-size: $size-7;
        font-weight: $weight-bold;
      }
      .retailer-address {
        font-size: $size-7;
      }
      .retailer-actions {
        text-align: center;
        padding: $size-7;
      }

      &:after {
        position: absolute;
        content: '›';
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 8px;
      }
      &.is-selected {
        &,
        &:hover {
          border: 1px solid $primary;
        }
        &:after {
          content: '';
          background-color: $primary;
          height: 100%;
          // display: inline-block;
        }
      }

      &:hover {
        background-color: $light;
      }
    }
  }

  @include mobile {
    padding-bottom: 0;
    display: block;
    .location-search {
      height: auto;
      overflow-y: visible;
      padding: 0 $size-7;
    }
  }
}
</style>
