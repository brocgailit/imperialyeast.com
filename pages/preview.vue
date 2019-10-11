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
  name: 'PagePreview',
  mixins: [page],
  data() {
    return {
      page: null
    }
  },
  asyncData() {
    return {}
  },
  mounted() {
    window.addEventListener(
      'message',
      event => {
        this.page = event.data.entry
      },
      false
    )
  }
}
</script>
