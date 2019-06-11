<template>
  <div :style="{ height: height + 'px', width: width ? width + 'px' : '100%' }">
    <no-ssr>
      <l-map ref="leaflet" :zoom="zoom" :center="autoCenter">
        <l-tile-layer
          url="https://api.maptiler.com/maps/voyager/{z}/{x}/{y}.png?key=wrAjh6ce8ZQM400eeGXR"
        />
        <l-markercluster>
          <l-marker
            v-for="marker of markers"
            :id="marker.id"
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
export default {
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
    }
  },
  data() {
    return {
      center: null,
      rotation: 0,
      geolocPosition: undefined,
      overlay: {
        position: [0, 0],
        title: 'Hello World',
        content: '<p>Stuff</p>',
        active: false
      },
      selectedFeatures: [],
      icon: {
        iconUrl: '/img/map-marker.svg',
        iconSize: [30, 37], // size of the icon
        iconAnchor: [15, 37], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
      }
    }
  },
  computed: {
    markerIcon() {
      if (this.$L) {
        return this.$L.icon(this.icon)
      } else {
        return null
      }
    },
    selected() {
      return this.markers.find(m =>
        this.selectedFeatures.some(f => f.id === m.id)
      )
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
  methods: {
    handleMounted(vlMap) {
      vlMap.refresh()
    }
  }
}
</script>

<style lang="scss">
.leaflet-container {
  font-size: $size-6;
  a.leaflet-popup-close-button {
    padding: 8px 8px 0 0;
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
      padding: 0 8px 0 $size-7;
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
        font-size: $size-7;
      }
      a {
        text-decoration: none;
        display: block;
        margin: 8px;
      }
      & /deep/ p {
        line-height: 1;
        font-size: 11px !important;
      }
    }
  }
}
</style>
