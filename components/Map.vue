<template>
  <div
    class="map-container"
    :style="[{ height: height + 'px', width: width ? width + 'px' : '100%' }]"
  >
    <no-ssr>
      <l-map
        ref="leaflet"
        :zoom="zoom"
        :min-zoom="2"
        :center="autoCenter"
        :options="{ dragging: enableDragging }"
        :max-bounds="[[-135, -225], [90, 225]]"
      >
        <l-tile-layer
          url="https://api.maptiler.com/maps/6f20cc0d-4242-40e6-b6b8-c51e19fab521/{z}/{x}/{y}.png?key=I4ED3WrAmXTdwheK6O5k"
        />
        <l-markercluster :options="clusterOptions">
          <l-marker
            v-for="marker of markers"
            :id="marker.id"
            ref="markers"
            :key="marker.id"
            :icon="markerIcon"
            :lat-lng="marker.coords"
          >
            <l-popup class="popup">
              <header class="popup-header">
                <span class="popup-header-title">
                  {{ marker.popup.title }}
                </span>
              </header>
              <div class="popup-content">
                <div class="content" v-html="marker.popup.content" />
              </div>
            </l-popup>
          </l-marker>
        </l-markercluster>
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import LMarkercluster from 'vue2-leaflet-markercluster'
import { Icon, Point, divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LMarkercluster
  },
  props: {
    height: {
      type: Number,
      default: 400
    },
    width: {
      type: Number,
      default: null
    },
    markers: {
      type: Array,
      default: () => []
    },
    zoom: {
      type: Number,
      default: 12
    },
    center: {
      type: Array,
      default: () => null
    },
    selected: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      markerIcon: null,
      rotation: 0,
      geolocPosition: undefined,
      overlay: {
        position: [0, 0],
        title: 'Hello World',
        content: '<p>Stuff</p>',
        active: false
      },
      icon: {
        iconUrl: '/img/map-marker.svg',
        iconSize: [30, 37], // size of the icon
        iconAnchor: [15, 37], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
      },
      clusterOptions: {},
      enableDragging: true
    }
  },
  computed: {
    responsiveHeight() {
      if (typeof window === 'undefined') return this.height
      return window.matchMedia('(max-width: 768px)').matches
        ? this.mobileHeight
        : this.height
    },
    autoCenter() {
      function averageGeolocation(coords) {
        if (coords.length === 1) return coords[0]

        let x = 0.0
        let y = 0.0
        let z = 0.0

        for (const coord of coords) {
          const latitude = (coord[0] * Math.PI) / 180
          const longitude = (coord[1] * Math.PI) / 180

          x += Math.cos(latitude) * Math.cos(longitude)
          y += Math.cos(latitude) * Math.sin(longitude)
          z += Math.sin(latitude)
        }

        const total = coords.length

        x = x / total
        y = y / total
        z = z / total

        const centralLongitude = Math.atan2(y, x)
        const centralSquareRoot = Math.sqrt(x * x + y * y)
        const centralLatitude = Math.atan2(z, centralSquareRoot)

        return [
          (centralLatitude * 180) / Math.PI,
          (centralLongitude * 180) / Math.PI
        ]
      }
      return (
        this.center ||
        averageGeolocation(
          this.markers.length > 0 ? this.markers.map(m => m.coords) : [[0, 0]]
        )
      )
    }
  },
  watch: {
    selected: function(id) {
      // open popup
      const { mapObject } = this.$refs.leaflet
      const marker = this.$refs.markers.find(m => m.$attrs.id === id).mapObject
      mapObject.flyTo(marker.getLatLng(), 14, { duration: 1.75 })
      mapObject.once('moveend', () => marker.openPopup())
    }
  },
  mounted() {
    // set options
    // this.$nextTick(() => {
    this.markerIcon = new Icon(this.icon)
    this.clusterOptions = {
      showCoverageOnHover: false,
      iconCreateFunction: cluster => {
        return divIcon({
          html: `<div class="marker-count">${cluster.getChildCount()}</div>`,
          className: 'marker-cluster',
          iconSize: new Point(40, 49)
        })
      }
    }

    this.enableDragging = window.matchMedia('(min-width: 769px)').matches
    // })
  },
  methods: {
    handleMounted(vlMap) {
      vlMap.refresh()
    }
  }
}
</script>

<style lang="scss">
@import 'leaflet.markercluster/dist/MarkerCluster.css';
@import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
.map-container {
  @include mobile {
    max-height: 300px;
  }
}
.leaflet-container {
  font-size: $size-6;
  a.leaflet-popup-close-button {
    padding: 0.4em 0.4em 0 0;
    color: $primary;
    font-size: $size-4;
    height: $size-4;
    width: $size-4;
  }
}
.leaflet-popup-tip {
  background-color: $white;
}
.leaflet-popup-content-wrapper {
  background-color: transparent;
  padding: 0;
}
.leaflet-popup-content {
  border-radius: $radius;
  box-shadow: 1px 2px 10px rgba($dark, 0.5);
  max-width: 300px;
  min-width: 275px;
  margin: 0;
  .popup {
    border-radius: $radius;
    .popup-header {
      position: relative;
      display: flex;
      padding: 0 1.25rem 0 $size-7;
      border-top-right-radius: $radius;
      border-top-left-radius: $radius;
      justify-content: space-between;
      align-items: center;
      background-color: $dark;
      font-weight: $weight-bold;
      color: $white;
      * {
        margin: 8px;
      }
    }
    .popup-content {
      background-color: $white;
      color: $dark;
      padding: $size-7;
      border-bottom-right-radius: $radius;
      border-bottom-left-radius: $radius;
      text-align: center;
      address {
        font-size: $size-6;
      }
      a {
        margin: 8px 0 0;
      }
      & ::v-deep p {
        line-height: 1;
        font-size: 11px !important;
      }
    }
  }
}

.marker-cluster {
  .marker-count {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $family-heading;
    font-size: $size-6;
    background-color: $white;
    color: $primary;
    border: 2px solid $primary;
    top: -10px;
    right: -10px;
  }
  &:before {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-image: url('/img/map-marker.svg');
  }
}
</style>
