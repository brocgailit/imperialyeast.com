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
        transform: 'translateY(calc(-50% + ' + parallaxOffset + 'px))'
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
        <header v-if="layout.heading">
          <h3>{{ layout.heading }}</h3>
          <h4 v-if="layout.subheading">{{ layout.subheading }}</h4>
        </header>
        <div v-if="layout.body" class="body" v-html="layout.body" />
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
    <ul
      v-if="layout.bullets && layout.bullets.length"
      class="bullet-list container"
    >
      <li v-for="(bullet, b) of layout.bullets" :key="b" class="bullet">
        <div class="bullet-icon" :style="{ 'background-color': bullet.color }">
          <fa-icon :icon="['fal', bullet.icon]" size="4x" />
        </div>
        <h4 class="bullet-title">{{ bullet.title }}</h4>
        <div class="bullet-text" v-html="bullet.text" />
      </li>
    </ul>

    <div
      v-if="layout.forms && layout.forms.length"
      class="form-container container"
    >
      <dynamic-form v-for="(form, f) of layout.forms" :key="f" :form="form" />
    </div>
  </section>
</template>

<script>
import DynamicForm from '~/components/Form.vue'
import supportsWebP from 'supports-webp'
export default {
  components: {
    DynamicForm
  },
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

      const width =
        typeof window !== 'undefined' &&
        window.matchMedia('(min-width: 769px)').matches
          ? 1920
          : 768
      return this.layout.background_image && this.isVisible
        ? `url(${this.layout.background_image.data.thumbnails.find(
            t => t.width === width
          ).url + format})`
        : null
    }
  },
  async mounted() {
    if (
      this.layout.background_image &&
      window.matchMedia('(min-width: 1024px)').matches
    ) {
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
.content-block {
  position: relative;
  overflow: hidden;
  padding: $size-1 $size-7;

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
    margin-bottom: $size-4;
    line-height: 1.1;
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
    min-height: 50vh;
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
    width: 125%;
    height: 250%;
    background-position: 50% 40%;
    background-repeat: no-repeat;
    background-size: 125%;
  }

  .layout-actions {
    text-align: center;
    margin-top: $size-3;
  }

  .bullet-list {
    $bullet-icon-size: 150px;
    display: flex;
    justify-content: space-around;
    text-align: center;
    .bullet {
      width: 350px;
      .bullet-title {
        font-weight: $weight-bold;
        font-size: $size-4;
      }
      .bullet-text {
        margin-top: $size-7;
      }
      .bullet-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto $size-5;
        color: $white;
        width: $bullet-icon-size;
        height: $bullet-icon-size;
        border-radius: 100%;
      }
    }
  }
  .form-container {
    max-width: $readability-width;
  }
  @include mobile {
    padding: $size-2 $size-7;
    header {
      margin-bottom: $size-7;
    }
    h3 {
      font-size: $size-3;
    }
    .layout-content.has-image > * {
      padding: $size-7;
    }
  }

  @include touch {
    .background-image {
      transform: translate(0, 0) !important;
      width: 100%;
      height: 100%;
      background-size: cover;
    }
  }
}
</style>
