<template>
  <div class="trust-icons container">
    <h3 v-if="layout.settings.heading" class="trust-icons-heading">
      {{ layout.settings.heading }}
    </h3>
    <div
      :id="layout.settings.id"
      class="level"
      :class="layout.settings.class"
      :style="layout.settings.style"
    >
      <div
        v-for="(item, i) of layout.settings.icons"
        :key="i"
        class="level-item is-narrow"
      >
        <component
          :is="item.value.path ? 'a' : 'div'"
          :href="item.value.path || null"
          :rel="item.value.path ? 'noopener nofollow' : null"
          :target="item.value.path ? '_blank' : null"
          :title="
            item.value.path ? 'Go to the ' + item.value.name + ' Website' : null
          "
        >
          <no-ssr>
            <v-lazy-image
              :src="item.value.image.path | asset({ h: 70 })"
              :alt="item.value.name + ' Logo'"
              use-picture
            >
              <source
                type="image/webp"
                :srcset="item.value.image.path | asset({ h: 70, fm: 'webp' })"
              />
            </v-lazy-image>
          </no-ssr>
        </component>
      </div>
    </div>
  </div>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'TrustIconsLayout',
  mixins: [component]
}
</script>

<style lang="scss">
.trust-icons {
  .trust-icons-heading {
    text-transform: uppercase;
    text-align: center;
    font-size: $size-6;
    opacity: 0.65;
  }

  .trust-icons-heading,
  .level {
    margin-bottom: $size-6;
  }

  .level {
    justify-content: space-around;
  }

  .level-item {
    text-align: center;
  }
}
</style>
