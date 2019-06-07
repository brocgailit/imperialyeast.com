<template>
  <div class="carousel">
    <div v-for="(slide, idx) of slides" :key="idx" class="carousel-slide">
      <transition name="fade-in-out">
        <picture v-show="active === idx">
          <source
            :srcset="slide | srcset({ format: 'webp' })"
            sizes="100vw"
            type="image/webp"
          />
          <source :srcset="slide | srcset" sizes="100vw" :type="slide.type" />
          <img
            :src="slide.data.thumbnails.find(t => t.width === 375).url"
            :alt="slide.title"
          />
        </picture>
      </transition>
    </div>
    <div class="carousel-content">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  filters: {
    srcset(image, options = {}) {
      const { format, breakpoints } = options
      return (breakpoints || [375, 1024, 1280, 1920])
        .map(
          w =>
            image.data.thumbnails.find(t => t.width === w).url +
            (format ? `?format=${format}` : '') +
            ` ${w}w`
        )
        .join(',')
    }
  },
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      active: 0,
      interval: null
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.mobile
    })
  },
  mounted() {
    this.interval = setInterval(() => this.next(), this.duration)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    next() {
      // go next
      if (this.active + 1 < this.slides.length) {
        this.active = this.active + 1
      } else {
        this.active = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel,
.carousel-content,
.carousel-slide,
.carousel-slide img {
  width: 100%;
  height: 100%;
}
.carousel {
  position: relative;
  min-height: 500px;
  background-color: $black;
}

.carousel-slide {
  img {
    object-fit: cover;
  }
}
.carousel-slide,
.carousel-content {
  position: absolute;
  top: 0;
  left: 0;
}

.carousel-content {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-in-out-enter-active,
.fade-in-out-leave-active {
  transition: opacity 1s linear;
}
.fade-in-out-enter,
.fade-in-out-leave-to {
  opacity: 0;
}
</style>
