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
        <div class="body" v-html="layout.body" />
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
  padding: $size-1;
  header {
    text-align: center;
  }
  h1 {
    font-family: $family-heading;
    font-size: $size-1;
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
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .container {
      max-width: $readability-width;
    }
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
}
</style>
