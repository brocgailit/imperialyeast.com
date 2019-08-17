<template>
  <section
    :id="layout.settings.id"
    class="section"
    :class="layout.settings.class"
    :style="layout.settings.style"
  >
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="(layout, l) of layout.children"
      :key="l"
      :layout="layout"
    />
  </section>
</template>

<script>
import { COMPONENTS } from '~/assets/script/components'
import { component } from '~/assets/script/mixins'
export default {
  name: 'SectionLayout',
  mixins: [component],
  data() {
    return {
      COMPONENTS
    }
  }
}
</script>

<style lang="scss">
.section .image-layout {
  max-width: 1200px;
  margin: 0 auto;
  display: block;
}

.section .title:not(:first-of-type) {
  margin-top: $size-5;
}

.section > *:last-child {
  padding-bottom: 0;
}
</style>
