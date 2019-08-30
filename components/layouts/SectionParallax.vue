<template>
  <section
    :id="layout.settings.id"
    v-observe-visibility="{
      callback: visibilityChanged,
      intersection: {
        rootMargin: '25%'
      },
      once: true
    }"
    class="section section-parallax"
    :class="[layout.settings.class, 'is-' + (layout.settings.size || 'medium')]"
    :style="layout.settings.style"
  >
    <div
      v-if="background && isVisible"
      class="background-image"
      :style="{
        'background-image': 'url(' + background + ')',
        transform: 'translateY(calc(-50% + ' + parallaxOffset + 'px))'
      }"
    />
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
  name: 'SectionParallaxLayout',
  mixins: [component],
  data() {
    return {
      COMPONENTS,
      isVisible: false,
      parallaxAnimation: null,
      parallaxOffset: 0,
      supportsWebP: true
    }
  },
  computed: {
    images() {
      return (this.layout.media || []).filter(
        m => m.file && m.file.type.startsWith('image')
      )
    },
    background() {
      if (!this.layout.settings.background) return null
      const w =
        typeof window !== 'undefined' &&
        window.matchMedia('(min-width: 769px)').matches
          ? 1600 // 1600x1600 square
          : 768
      const fm = this.supportsWebP ? 'webp' : 'jpeg'
      return this.$options.filters.asset(this.layout.settings.background.path, {
        w,
        h: w,
        fm,
        fit: 'crop'
      })
    }
  },
  mounted() {
    if (this.background && window.matchMedia('(min-width: 1024px)').matches) {
      this.parallaxAnimation = requestAnimationFrame(this.setScrollParallax)
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.parallaxAnimation)
  },
  methods: {
    setScrollParallax() {
      this.parallaxOffset =
        (document.body.scrollTop || document.documentElement.scrollTop) * 0.17
      this.parallaxAnimation = requestAnimationFrame(this.setScrollParallax)
    },
    visibilityChanged(isVisible) {
      this.isVisible = isVisible
    }
  }
}
</script>

<style lang="scss">
.section-parallax {
  position: relative;
  overflow: hidden;
  background-color: $black;
  color: $white;
  font-weight: $weight-bold;
  .background-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 250%;
    background-position: 50% 40%;
    background-repeat: no-repeat;
    background-size: 100%;
    opacity: 0.35;
  }
  .title {
    color: $white;
  }
  a {
    color: lighten($primary, 20%);
    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
