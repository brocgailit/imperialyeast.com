<template>
  <div class="carousel">
    <div v-for="(slide, idx) of slides" :key="idx" class="carousel-slide">
      <transition v-if="loadAll || idx === active" name="fade-in-out">
        <responsive-image
          v-show="active === idx"
          :file="slide.file"
          :alt="slide.description"
        />
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
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      active: 0,
      interval: null,
      loadAll: false
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.mobile
    })
  },
  mounted() {
    setTimeout(() => (this.loadAll = true), this.duration - 1000)
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
.carousel-slide ::v-deep img {
  width: 100%;
  height: 100%;
}

::v-deep img {
  object-fit: cover;
}

.carousel {
  position: relative;
  min-height: 500px;
  background-color: $black;
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
