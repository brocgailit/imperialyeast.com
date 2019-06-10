<template>
  <section
    v-observe-visibility="{
      callback: visibilityChanged,
      intersection: {
        rootMargin: '25%'
      },
      once: true
    }"
    class="content-block"
    :class="{ 'has-background': layout.background_image }"
    :style="{
      'background-color': layout.background_color,
      color: layout.text_color
    }"
  >
    <div
      v-if="layout.background_image"
      class="background-image"
      :style="{
        'background-image': background,
        transform: 'translateY(calc(-66vh + ' + parallaxOffset + 'px))'
      }"
    />
    <div
      class="container layout-content"
      :class="[
        'is-' + (layout.content_direction || 'column'),
        { 'has-image': images.length }
      ]"
    >
      <article>
        <header>
          <h3>{{ layout.heading }}</h3>
          <h4 v-if="layout.subheading">{{ layout.subheading }}</h4>
        </header>
        <div class="body" v-html="layout.body" />
        <layout-actions
          v-if="layout.actions && layout.actions.length"
          class="layout-actions"
          :actions="layout.actions"
        />
      </article>
      <div v-if="images.length" class="image-container">
        <responsive-image
          v-for="image of images"
          :key="image.file.id"
          :file="image.file"
          :alt="image.description"
          lazy
        />
      </div>
    </div>
  </section>
</template>

<script>
import supportsWebP from 'supports-webp'
export default {
  props: {
    layout: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      isVisible: false,
      parallaxAnimation: null,
      parallaxOffset: 0,
      supportsWebP: true // TODO: make webp check in clientinit and save in store?
    }
  },
  computed: {
    images() {
      return (this.layout.media || []).filter(
        m => m.file && m.file.type.startsWith('image')
      )
    },
    background() {
      let format
      if (this.supportsWebP) {
        format = '?format=webp'
      }
      return this.layout.background_image && this.isVisible
        ? `url(${this.layout.background_image.data.thumbnails.find(
            t => t.width === 1280 // TODO: this should be responsive!
          ).url + format})`
        : null
    }
  },
  async mounted() {
    if (this.layout.background_image) {
      this.parallaxAnimation = requestAnimationFrame(this.setScrollParallax)
    }
    this.supportsWebP = await supportsWebP
  },
  beforeDestroy() {
    cancelAnimationFrame(this.parallaxAnimation)
  },
  methods: {
    setScrollParallax() {
      this.parallaxOffset =
        (document.body.scrollTop || document.documentElement.scrollTop) * 0.2
      this.parallaxAnimation = requestAnimationFrame(this.setScrollParallax)
    },
    visibilityChanged(isVisible) {
      this.isVisible = isVisible
    }
  }
}
</script>

<style lang="scss">
.content-block {
  position: relative;
  overflow: hidden;
  padding: $size-1;

  .layout-content {
    display: flex;
    flex-direction: column-reverse;
    &.is-row {
      flex-direction: row-reverse;
    }
    &.is-row-reverse {
      flex-direction: row;
    }

    &.is-row,
    &.is-row-reverse {
      &.has-image {
        align-items: center;
      }
    }
    &.is-column-reverse {
      flex-direction: column;
    }
    &.has-image {
      > * {
        flex: 0 0 50%;
        padding: $size-5;
      }
    }
    &:not(.has-image) {
      max-width: $readability-width;
    }
  }

  header {
    text-align: center;
  }
  h3 {
    font-family: $family-heading;
    font-size: $size-2;
  }
  .body {
    .ql-align-center {
      text-align: center;
    }
    .ql-align-right {
      text-align: right;
    }
    .ql-align-left {
      text-align: left;
    }
    .ql-align-justify {
      text-align: justify;
    }
  }

  &.has-background {
    color: $white;
    height: 66vh;
    display: flex;
    justify-content: center;
    align-items: center;
    h3 {
      font-family: $family-primary;
      text-transform: uppercase;
      font-weight: $weight-black;
    }
    .body {
      font-weight: $weight-bold;
    }
  }

  .background-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 250%;
    background-position: 50% 33%;
    background-repeat: no-repeat;
    background-size: 125%;
  }
}

.layout-actions {
  text-align: center;
  margin-top: $size-3;
}
</style>
