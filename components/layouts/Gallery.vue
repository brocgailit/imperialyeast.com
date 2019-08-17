<template>
  <no-ssr>
    <div
      :id="layout.settings.id"
      v-visibility="{
        callback: v => (visible = v),
        intersection: {
          rootMargin: '25%'
        },
        once: true
      }"
      class="gallery-layout"
      :class="layout.settings.class"
      :style="layout.settings.style"
    >
      <div class="images">
        <div
          v-for="(image, i) of images"
          :key="i"
          class="image-container"
          @click="setIndex(i)"
        >
          <v-lazy-image
            :src="image.path + '?h=250'"
            alt="image.title"
            use-picture
          >
            <source type="image/webp" :srcset="image.path + '?fm=webp&h=250'" />
          </v-lazy-image>
          <div v-if="captions" class="image-caption">
            <p>Ello!{{ image.title }}</p>
          </div>
        </div>
      </div>
      <no-ssr>
        <!-- <portal v-if="images.length > 1" to="image-gallery" class="image-gallery"> -->
        <gallery
          :images="images.map(i => i.path)"
          :index="index"
          @close="index = null"
          @onslide="slide = $event.index"
        />
        <div v-if="index !== null && captions" class="gallery-overlay">
          <p class="gallery-overlay-caption">
            {{ images[slide].title }}
          </p>
        </div>
        <!-- </portal> -->
      </no-ssr>
      <div />
    </div>
  </no-ssr>
</template>
<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'GalleryLayout',
  mixins: [component],
  data() {
    return {
      active: {},
      visible: false,
      index: null,
      slide: 0,
      captions: false
    }
  },
  computed: {
    images() {
      return this.layout.settings.gallery
    }
  },
  methods: {
    setIndex(index) {
      this.index = index
      this.slide = index
    }
  }
}
</script>

<style lang="scss">
.gallery-layout {
  .images {
    width: 100%;
    padding: $size-5;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    min-height: 350px;

    img {
      max-width: 400px;
      max-height: 500px;
    }
    .image-container {
      position: relative;
      cursor: pointer;
      margin: 4px;

      .image-caption {
        font-weight: $weight-bold;
        font-size: $size-6;
        padding: 0 4px 4px;
        p {
          text-align: center;
          margin: 0;
          line-height: 1;
        }

        @include fullhd {
          font-size: $size-5;
          p {
            margin: $size-7 0;
          }
        }
      }
    }
    @include mobile {
      overflow-x: auto;
      overflow-y: hidden;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }
  }
}
</style>
