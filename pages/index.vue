<template>
  <div>
    <h1>Pitches for Commercial and Homebrewing</h1>
    <h2>Organic Yeast Grown in Portland, Oregon</h2>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
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
    const slug = 'home'
    const fields = [
      '*.*',
      'layouts.*.*',
      'layouts.attachments.directus_files_id.title',
      'layouts.attachments.directus_files_id.type',
      'layouts.attachments.directus_files_id.data.*.*'
    ]
    const page = await $axios
      .$get(`items/pages?single=1&slug=${slug}&fields=${fields.join(',')}`)
      .then(res => res.data)
    return { page }
  }
}
</script>
