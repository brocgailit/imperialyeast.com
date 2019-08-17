<template>
  <responsive-image
    :id="layout.settings.id"
    class="image-layout"
    :class="layout.settings.class"
    :style="layout.settings.style"
    :path="layout.settings.image.path"
    :alt="layout.settings.id"
    :width="layout.settings.width"
    :height="layout.settings.height"
  />
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'ImageLayout',
  mixins: [component]
}
</script>
