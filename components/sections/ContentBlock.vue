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
    :class="{
      'has-background': layout.background_image,
      'no-padding-bottom': layout.remove_padding_bottom,
      'no-padding-top': layout.remove_padding_top
    }"
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
      class="layout-content"
      :class="[
        'is-' + (layout.content_direction || 'column'),
        {
          'has-image': images.length,
          'has-image-fullwidth': layout.full_width_images
        }
      ]"
    >
      <div
        v-if="images.length"
        class="image-container"
        :class="{
          'has-many': images.length > 1,
          container: !layout.full_width_images
        }"
      >
        <div v-for="image of images" :key="image.file.id">
          <nuxt-link
            v-if="image.link && image.link.indexOf('http') < 0"
            :to="image.link"
            :aria-label="image.description"
          >
            <responsive-image
              :file="image.file"
              :alt="image.description"
              lazy
              :style="{ flex: '0 0 ' + 100 / images.length + '%' }"
            />
          </nuxt-link>
          <a
            v-else-if="
              (image.attachment && image.attachment.data.url) || image.link
            "
            target="_blank"
            rel="noopener"
            :href="image.attachment ? image.attachment.data.url : image.link"
            :aria-label="image.description"
          >
            <responsive-image
              :file="image.file"
              :alt="image.description"
              lazy
              :style="{ flex: '0 0 ' + 100 / images.length + '%' }"
            />
          </a>
          <responsive-image
            v-else
            :file="image.file"
            :alt="image.description"
            lazy
            :style="{ flex: '0 0 ' + 100 / images.length + '%' }"
          />
        </div>
      </div>
      <article class="container">
        <header v-if="layout.heading">
          <h3>{{ layout.heading }}</h3>
          <h4 v-if="layout.subheading">{{ layout.subheading }}</h4>
        </header>
        <div
          v-if="layout.body"
          class="body"
          :class="'ql-align-' + (layout.text_align || 'left')"
          v-html="layout.body"
        />
        <layout-actions
          v-if="layout.actions && layout.actions.length"
          class="layout-actions"
          :actions="layout.actions"
        />
      </article>
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

    <div v-if="layout.form" class="form-container container">
      <dynamic-form :form="layout.form" />
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
      const format = this.supportsWebP ? '?format=webp' : ''

      const width =
        typeof window !== 'undefined' &&
        window.matchMedia('(min-width: 769px)').matches
          ? 1600 // 1600x1600 square
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
  padding: $size-1 0;

  &.no-padding-bottom {
    padding-bottom: 0;
  }

  &.no-padding-top {
    padding-top: 0;
  }

  .layout-content {
    margin: 0 auto;
    article {
      padding: 0 $size-7;
    }
    @include desktop {
      display: flex;
      flex-direction: column;
      &.is-row {
        flex-direction: row;
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
        flex-direction: column-reverse;
      }
      &.has-image {
        > * {
          flex: 0 0 50%;
          padding: $size-5;
        }
      }
    }

    .body {
      margin: 0 auto;
      max-width: $readability-width;
    }

    &.has-image.has-image-fullwidth {
      .image-container {
        padding: 0 !important;
        * {
          width: 100%;
        }
      }
      &.is-column {
        .body {
          padding-top: $size-1;
        }
      }
      &.is-column-reverse {
        .body {
          padding-bottom: $size-1;
        }
      }
      @include touch {
        &.is-column {
          .body {
            padding-top: $size-3;
          }
        }
        &.is-column-reverse {
          .body {
            padding-bottom: $size-3;
          }
        }
      }
    }
  }

  header {
    text-align: center;
    margin-bottom: $size-4;
    line-height: 1.1;
  }
  h3 {
    @include brand-font;
    font-size: $size-1 * 0.85;
  }
  h4 {
    margin-top: $size-7 / 2;
    font-size: $size-5;
    font-weight: $weight-bold;
    text-transform: uppercase;
  }
  .body {
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

    h3,
    h4,
    h5 {
      text-align: center;
    }
    p:not(:last-child) {
      margin-bottom: $size-5;
    }
  }

  &.has-background {
    background-color: $black;
    color: $white;
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    h3 {
      font-size: $size-1;
      @include mobile {
        font-size: $size-2;
      }
    }
    .body {
      font-weight: $weight-bold;
    }
    a:not(.button) {
      color: lighten($primary, 30%);
    }
  }

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

  .image-container {
    &.has-many {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      flex-wrap: nowrap;
      > * {
        padding: $size-5;
        max-width: 200px;
      }
    }

    &,
    > * {
      text-align: center;
    }
  }

  .is-column:not(.has-image-fullwidth),
  .is-column-reverse:not(.has-image-fullwidth) {
    .image-container:not(.has-many) {
      picture {
        img {
          max-height: 400px;
          width: auto;
        }
        @include mobile {
          max-height: 300px;
        }
      }
    }
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
    margin-top: $size-4;
    max-width: $readability-width;
    padding: $size-7;
  }

  picture {
    display: block;
    img {
      display: table;
    }
  }

  @include touch {
    padding: $size-3 0;
    .image-container {
      display: flex;
      justify-content: center;
      margin-bottom: $size-5;
    }

    .has-image-fullwidth {
      .image-container {
        margin: 0;
      }
    }

    .background-image {
      transform: translate(0, 0) !important;
      width: 100%;
      height: 100%;
      background-size: cover;
    }

    .layout-content {
      &.is-column-reverse {
        display: flex;
        flex-direction: column-reverse;
      }
    }
  }

  @include mobile {
    article {
      padding: $size-2 $size-7;
    }
    header {
      margin-bottom: $size-7;
    }
    h3 {
      font-size: $size-2;
    }
    h4 {
      font-size: $size-6;
      margin-top: 0;
    }
    .layout-content.has-image > * {
      padding: $size-7;
    }

    .bullet-list {
      display: block;
      .bullet {
        width: 100%;
        .bullet-title {
          font-size: $size-5;
        }
        .bullet-text {
          font-size: $size-6;
        }
      }
      .bullet:not(:last-child) {
        margin-bottom: $size-5;
      }
    }
  }
}
</style>
