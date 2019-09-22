<template>
  <div
    :id="layout.settings.id"
    class="trust-icons container"
    :class="layout.settings.class"
    :style="layout.settings.style"
  >
    <h3 v-if="layout.settings.heading" class="trust-icons-heading">
      {{ layout.settings.heading }}
    </h3>
    <icon-list :icons="layout.settings.icons.slice(0, 4)" :size="125" />
    <icon-list
      :icons="layout.settings.icons.slice(4, layout.settings.icons.length)"
      :size="60"
    />
    <p
      v-if="layout.settings.action && layout.settings.action.path"
      class="has-text-centered"
    >
      <nuxt-link :to="layout.settings.action.path" class="trust-icons-action">
        {{ layout.settings.action.label || 'Find out more' }}
      </nuxt-link>
    </p>
  </div>
</template>

<script>
import { component } from '~/assets/script/mixins'
import IconList from '~/components/IconList.vue'
export default {
  name: 'TrustIconsLayout',
  components: {
    IconList
  },
  mixins: [component]
}
</script>

<style lang="scss">
.trust-icons {
  padding: $size-6 0;
  .trust-icons-heading {
    text-transform: uppercase;
    text-align: center;
    font-size: $size-6;
    font-weight: $weight-bold;
  }

  .trust-icons-heading {
    margin-bottom: $size-6;
  }

  .trust-icons-action {
    font-size: $size-7;
    text-transform: uppercase;
  }
}
</style>
