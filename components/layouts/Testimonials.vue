<template>
  <div
    :id="layout.settings.id"
    class="container"
    :class="layout.settings.class"
    :style="layout.settings.style"
  >
    <div
      class="testimonials"
      @mousedown="stop"
      @mouseup="start"
      @mouseover="stop"
      @mouseleave="start"
      @touchstart="stop"
      @touchend="start"
    >
      <div
        v-if="testimonials && testimonials.length"
        ref="container"
        class="testimonials-container"
        :class="[
          scrolling ? 'scrolling-' + scrolling : '',
          { 'is-scrolling': !!scrolling }
        ]"
      >
        <testimonial
          v-for="testimonial of testimonials"
          :key="testimonial._id"
          ref="testimonial"
          :testimonial="testimonial"
          class="testimonial"
        />
      </div>
      <button
        v-if="hasPrevious"
        class="testimonial-control control-left"
        @click="prev"
      >
        <fa-icon :icon="['fal', 'chevron-left']" size="4x" />
      </button>
      <button
        v-if="hasNext"
        class="testimonial-control control-right"
        @click="next"
      >
        <fa-icon :icon="['fal', 'chevron-right']" size="4x" />
      </button>
    </div>
  </div>
</template>

<script>
import Testimonial from '~/components/Testimonial.vue'
import { component } from '~/assets/script/mixins'
import shuffle from 'lodash/shuffle'
import * as TWEEN from '@tweenjs/tween.js'
export default {
  name: 'TestimonialsLayout',
  components: {
    Testimonial
  },
  mixins: [component],
  data() {
    return {
      index: 0,
      offset: 0,
      interval: null,
      scrolling: null
    }
  },
  computed: {
    testimonials() {
      return shuffle(this.layout.settings.testimonials) || []
    },
    hasNext() {
      return this.index + 1 < this.testimonials.length
    },
    hasPrevious() {
      return this.index - 1 >= 0
    }
  },
  watch: {
    index(idx, lastIdx) {
      const el = this.$refs.testimonial[idx].$el
      const { scrollLeft } = this.$refs.container
      this.scrolling = idx > lastIdx ? 'right' : 'left'
      this.tween(
        'offset',
        {
          start: +scrollLeft,
          end:
            scrollLeft +
            (el.getBoundingClientRect().x -
              this.$refs.container.getBoundingClientRect().x),
          duration: 400
        },
        () => (this.scrolling = null)
      )
    },
    offset(value) {
      this.$refs.container.scrollLeft = value
    }
  },
  mounted() {
    this.start()
  },
  beforeDestroy() {
    clearInterval(this.interval)
    this.stop()
  },
  methods: {
    start() {
      this.interval = setInterval(
        () => this.next(),
        this.layout.settings.rate || 1000
      )
    },
    stop() {
      clearInterval(this.interval)
    },
    restart() {
      this.stop()
      this.start()
    },
    next() {
      this.index = this.hasNext ? this.index + 1 : 0
      this.restart()
    },
    prev() {
      this.index = this.hasPrevious
        ? this.index - 1
        : this.testimonials.length - 1
      this.restart()
    },
    tween(value, { start, end, duration }, callback) {
      let frameHandler

      const animate = function(time) {
        TWEEN.update(time)
        frameHandler = requestAnimationFrame(animate)
      }

      const current = { value: start }
      const tween = new TWEEN.Tween(current)

      tween
        .to({ value: end }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          this[value] = current.value
        })
        .onComplete(() => {
          cancelAnimationFrame(frameHandler)
          callback()
        })
        .start()

      frameHandler = requestAnimationFrame(animate)
    }
  }
}
</script>

<style lang="scss" scoped>
.testimonials {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: cover;

  .testimonials-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    flex-flow: row nowrap;
    transition: 450ms -350ms ease-in-out;
    transform: translateZ(1px);
    &.is-scrolling {
      &.scrolling-right {
        transform-origin: top left;
        transform: skewX(5deg);
      }
      &.scrolling-left {
        transform-origin: top right;
        transform: skewX(-5deg);
      }
    }
    &:not(.is-scrolling) {
      scroll-snap-type: x mandatory;
    }
    -webkit-overflow-scrolling: touch;
    .testimonial {
      scroll-snap-align: center;
      @include desktop {
        padding-left: $size-1;
        padding-right: $size-1;
      }
    }
    &::-webkit-scrollbar-thumb,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background-color: rgba(0, 0, 0, 0);
    }
  }
}

.review-link {
  opacity: 0.85;
  color: $warning;
  display: flex;
  align-items: center;
  text-decoration: none;
  strong {
    @include brand-font;
    font-size: $size-5;
    margin-left: $size-8;
  }
  &:hover {
    opacity: 1;
  }
  @include mobile {
    display: block;
    text-align: center;
    margin-bottom: $size-5;
  }
  @include tablet {
    position: absolute;
    right: $size-3;
    bottom: $size-3;
  }
}

.testimonial-control {
  position: absolute;
  top: 0;
  width: 75px;
  height: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  color: $primary;
  &:hover {
    color: lighten($primary, 5%);
  }
  &.control-right {
    right: 0;
  }
  &.control-left {
    left: 0;
  }
  @include touch {
    display: none;
  }
}
</style>
