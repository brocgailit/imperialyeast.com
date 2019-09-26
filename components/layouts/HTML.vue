<template>
  <div
    :id="layout.settings.id"
    :class="layout.settings.class"
    :style="layout.settings.style"
    v-html="layout.settings.html"
  />
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'HTMLLayout',
  mixins: [component]
}
</script>
