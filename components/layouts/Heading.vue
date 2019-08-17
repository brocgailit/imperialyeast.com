<template>
  <component
    :is="tag"
    :id="layout.settings.id"
    class="container title"
    :class="[layout.settings.class]"
    :style="layout.settings.style"
  >
    {{ layout.settings.text }}
  </component>
</template>

<script>
import { component } from '~/assets/script/mixins'

export default {
  name: 'HeadingLayout',
  mixins: [component],
  computed: {
    tag() {
      return this.layout.settings.tag || 'h3'
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: $size-1;
}
h2 {
  font-size: $size-2;
}
h3 {
  font-size: $size-3;
}
h4 {
  font-size: $size-4;
}
h5,
h6 {
  font-size: $size-5;
}
</style>
