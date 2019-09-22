<template>
  <div class="button-layout container">
    <d-button
      :url="layout.settings.url"
      :custom-class="
        layout.settings.class ? layout.settings.class : 'is-primary'
      "
      :custom-style="layout.settings.style"
      :label="layout.settings.text"
    />
  </div>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'ButtonLayout',
  mixins: [component]
}
</script>

<style lang="scss">
.button-layout {
  padding: $size-6 $size-4 $size-4;
  text-align: center;
}
</style>
