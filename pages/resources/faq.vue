<template>
  <div>
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'
export default {
  name: 'FAQPage',
  mixins: [page],
  scrollToTop: true,
  async asyncData({ params, $axios }) {
    const slug = 'faq'
    const [page] = await $axios.$get(`collections/get/pages`, {
      params: {
        'filter[name_slug]': slug,
        limit: 1,
        simple: true,
        populate: 12,
        rspc: 1
      }
    })
    return { page }
  }
}
</script>
