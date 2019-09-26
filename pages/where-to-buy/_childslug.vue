<template>
  <section v-if="page && page.layouts">
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="(layout, l) of page.layouts"
      :key="l"
      :layout="layout"
    />
  </section>
</template>

<script>
import { page } from '~/assets/script/mixins'
export default {
  name: 'ChildPage',
  mixins: [page],
  async asyncData({ params, $axios, store, payload }) {
    if (payload) {
      return { page: payload }
    }
    const { childslug } = params
    const options = {
      limit: 1,
      simple: true,
      populate: 12,
      rspc: 1,
      filter: {}
    }
    if (!childslug) {
      options.filter._id = store.state.website.homepage._id
    } else {
      options.filter.name_slug = childslug
    }

    const [page] = await $axios.$post(`collections/get/pages`, options)

    return { page }
  }
}
</script>
