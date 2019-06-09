<template>
  <section
    class="content-block"
    :class="{ 'has-background': this.layout.background_image }"
  >
    <div
      v-if="this.layout.background_image"
      class="background-image"
      :style="{
        'background-image': background,
        transform: 'translateY(calc(-70vh + ' + parallaxOffset + 'px))'
      }"
    />
    <div class="container">
      <article>
        <header>
          <h3>{{ layout.heading }}</h3>
          <h4 v-if="layout.subheading">{{ layout.subheading }}</h4>
        </header>
        <div class="body" v-html="layout.body" />
      </article>
      <div v-if="images.length" class="image-container">
        <responsive-image
          v-for="image of images"
          :key="image.file.id"
          :lazy="true"
          :file="image.file"
          :alt="image.description"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    layout: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      parallaxAnimation: null,
      parallaxOffset: 0
    }
  },
  computed: {
    images() {
      return (this.layout.media || []).filter(
        m => m.file && m.file.type.startsWith('image')
      )
    },
    background() {
      return this.layout.background_image
        ? `url(${
            this.layout.background_image.data.thumbnails.find(
              t => t.width === 1920
            ).url
          })`
        : null
    }
  },
  mounted() {
    if (this.layout.background_image) {
      this.parallaxAnimation = requestAnimationFrame(this.setScrollParallax)
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.parallaxAnimation)
  },
  methods: {
    setScrollParallax() {
      this.parallaxOffset =
        (document.body.scrollTop || document.documentElement.scrollTop) * 0.2
      this.parallaxAnimation = requestAnimationFrame(this.setScrollParallax)
    }
  }
}
</script>

<style lang="scss">
.content-block {
  position: relative;
  overflow: hidden;
  padding: $size-1;
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
