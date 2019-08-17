<template>
  <no-ssr>
    <component
      :is="mapComponent"
      v-if="mapComponent"
      :markers="markers"
      :height="500"
      :zoom="zoom"
      :center="center"
      :selected="selected"
    />
  </no-ssr>
</template>

<script>
export default {
  name: 'LeafletMapLoader',
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
      mapComponent: null
    }
  },
  mounted() {
    this.mapComponent = () => import('~/components/Map.vue')
  }
}
</script>
