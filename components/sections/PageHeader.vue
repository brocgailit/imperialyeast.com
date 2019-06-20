<template>
  <section
    class="page-header"
    :class="{ 'has-background': layout.background_image }"
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
    margin-bottom: $size-5;
  }
  h1 {
    font-family: $family-heading;
    font-weight: $weight-medium;
    font-size: $size-1;
    margin-bottom: $size-7;
  }
  h2 {
    font-weight: $weight-black;
    font-size: $size-4;
    opacity: 0.85;
  }
  .body {
    margin-top: $size-3;
    a {
      font-weight: $weight-bold;
    }
    h4 {
      font-weight: $weight-bold;
      font-size: $size-4;
    }
    h3,
    h4,
    h5 {
      text-align: center;
      margin: $size-7;
    }
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
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
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

  @include mobile {
    padding: $size-3 $size-7;
    h1 {
      font-size: $size-2;
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
