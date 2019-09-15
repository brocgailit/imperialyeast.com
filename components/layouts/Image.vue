<template>
  <responsive-image
    :id="layout.settings.id"
    class="image-layout"
    :class="layout.settings.class"
    :style="layout.settings.style"
    :path="layout.settings.image.path"
    :alt="
      layout.settings.image.meta ? layout.settings.image.meta.title : 'Image'
    "
    :width="layout.settings.width"
    :height="layout.settings.height"
    lazy
  />
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'ImageLayout',
  mixins: [component]
}
</script>

<style lang="scss">
.image-layout {
  text-align: center;
}
</style>
