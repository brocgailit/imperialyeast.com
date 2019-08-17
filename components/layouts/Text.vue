<template>
  <div
    :id="layout.settings.id"
    class="container content"
    :class="layout.settings.class"
    :style="layout.settings.style"
    v-html="text"
  />
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'TextLayout',
  mixins: [component],
  computed: {
    text() {
      return this.layout.settings.text
    }
  }
}
</script>
