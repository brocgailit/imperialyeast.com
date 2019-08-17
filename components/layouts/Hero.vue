<template>
  <section
    class="hero"
    :class="[
      size,
      color,
      gradient,
      { 'has-background': !!layout.settings.background }
    ]"
  >
    <responsive-image
      v-if="layout.settings.background"
      class="hero-background"
      :path="layout.settings.background.path"
      :alt="layout.settings.title"
      :width="layout.settings.background.width"
      :height="layout.settings.background.height"
    />
    <div class="hero-body">
      <div class="container">
        <h1 class="title is-1">
          {{ layout.settings.title }}
        </h1>
        <h2 class="subtitle">
          {{ layout.settings.subtitle }}
        </h2>
        <div v-if="layout.children" class="components">
          <component
            :is="COMPONENTS.find(c => c.name === layout.component).ref"
            v-for="(layout, l) of layout.children"
            :key="l"
            :layout="layout"
          />
        </div>
        <div v-if="layout.settings.cta" class="actions">
          <d-button
            v-for="(action, a) of layout.settings.cta"
            :key="a"
            size="is-medium"
            :label="action.value.label"
            :url="action.value.path"
            :color="action.value.color"
            :title="action.value.title"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { COMPONENTS } from '~/assets/script/components'
import { component } from '~/assets/script/mixins'
export default {
  name: 'HeroLayout',
  mixins: [component],
  data() {
    return {
      COMPONENTS
    }
  },
  computed: {
    size() {
      const { size } = this.layout.settings
      return size ? `is-${size}` : 'is-medium'
    },
    color() {
      const { color } = this.layout.settings
      return color ? `is-${color}` : 'is-white'
    },
    gradient() {
      const { gradient } = this.layout.settings
      return gradient ? 'is-bold' : null
    }
  }
}
</script>

<style lang="scss">
.hero {
  position: relative;
  &.is-white {
    & + * {
      padding-top: 0;
    }
  }
  .hero-background {
    opacity: 0.5;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .hero-body {
    .components {
      margin: 0 auto;
      & + * {
        margin-top: $size-5;
      }
    }
    .actions {
      display: flex;
      justify-content: center;
    }

    @include mobile {
      .title {
        font-size: $size-2;
      }
      .subtitle {
        font-size: $size-6;
      }
    }
  }
}
</style>
