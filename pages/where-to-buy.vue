<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
    <nuxt-child :locations="locations" />
  </div>
</template>

<script>
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'

export default {
  data() {
    return {
      DYNAMIC_COMPONENTS
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
