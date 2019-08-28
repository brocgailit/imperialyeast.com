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
  name: 'Page',
  mixins: [page]
}
</script>
