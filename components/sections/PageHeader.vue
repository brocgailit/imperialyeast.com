<template>
  <section
    class="page-header"
    :class="{
      'has-background': layout.background_image,
      'no-padding-bottom': layout.remove_padding_bottom,
      'no-padding-top': layout.remove_padding_top
    }"
    :style="{
      'background-color': layout.background_color || 'none',
      color: layout.text_color || 'currentColor'
    }"
  >
    <div
      v-if="layout.background_image"
      class="background-image"
      :style="{ 'background-image': background }"
    />
    <div class="container">
      <article>
        <header>
          <h1>{{ layout.heading }}</h1>
          <h2 v-if="layout.subheading">{{ layout.subheading }}</h2>
        </header>
        <div
          v-if="layout.body"
          class="body"
          :class="'ql-align-' + (layout.text_align || 'left')"
          v-html="layout.body.replace(/\_blank/g, '_self')"
        />
      </article>
      <div v-if="images.length" class="image-container">
        <responsive-image
          v-for="image of images"
          :key="image.file.id"
          :file="image.file"
          :alt="image.description"
        />
      </div>
    </div>

    <layout-actions
      v-if="layout.actions && layout.actions.length"
      class="layout-actions"
      :actions="layout.actions"
    />
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
      return this.layout.background_image
        ? `url(${this.layout.background_image.data.thumbnails.find(
            t => t.width === 1920 // TODO: this should be responsive!
          ).url + format})`
        : null
    }
  },
  async mounted() {
    this.supportsWebP = await supportsWebP
  }
}
</script>

<style lang="scss">
.page-header {
  position: relative;
  overflow: hidden;
  padding: $size-1 $size-7;
  .container {
    max-width: $readability-width;
  }
  header {
    text-align: center;
    line-height: 1.1;
  }
  h1 {
    @include brand-font;
    font-size: $size-1;
    margin-bottom: $size-7 / 2;
  }
  h2 {
    font-weight: $weight-black;
    font-size: $size-5;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .body {
    margin-top: $size-3;
    a {
      font-weight: $weight-bold;
    }
    h3 {
      font-size: $size-5;
    }
    h5 {
      font-size: $size-6;
    }
    h3,
    h4,
    h5 {
      font-weight: $weight-black;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: center;
      margin: $size-7;
    }
    &.ql-align-center {
      text-align: center;
    }
    &.ql-align-right {
      text-align: right;
    }
    &.ql-align-left {
      text-align: left;
    }
    &.ql-align-justify {
      text-align: justify;
    }
    p:not(:last-child) {
      margin-bottom: $size-5;
    }
  }

  &.has-background {
    color: $white;
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.no-padding-bottom {
    padding-bottom: 0;
  }

  &.no-padding-top {
    padding-top: 0;
  }

  .background-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 200%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 125%;
  }

  .layout-actions {
    text-align: center;
    margin-top: $size-3;
  }

  @include mobile {
    padding: $size-3 $size-7;
    h1 {
      font-size: $size-1 * 0.85;
    }
    h2 {
      font-size: $size-5;
    }
    p {
      font-size: $size-6;
    }
  }
}
</style>
