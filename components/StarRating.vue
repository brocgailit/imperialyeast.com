<template>
  <div class="star-rating">
    <star
      v-for="(star, idx) of stars"
      :key="idx"
      :percent="star"
      :color="color"
    />
  </div>
</template>

<script>
import Star from '~/components/StarRatingStar.vue'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: 'StarRating',
  components: {
    Star
  },
  props: {
    value: {
      type: Number,
      default: 5
    },
    max: {
      type: Number,
      default: 5
    },
    min: {
      type: Number,
      default: 0
    },
    steps: {
      type: Number,
      default: 0.5
    },
    duration: {
      type: Number,
      default: 450
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      tweenedValue: 0
    }
  },
  computed: {
    stars() {
      const stars = Array(Math.ceil(this.max)).fill(0)
      const remainder = this.tweenedValue % 1
      let i = 0
      while (i < Math.floor(this.tweenedValue)) {
        stars[i++] = 1
      }
      if (remainder) stars[i++] = remainder
      return stars
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.tween(oldVal, newVal)
    }
  },
  mounted() {
    this.tween(0, this.value)
  },
  methods: {
    tween(start, end) {
      let frameHandler

      const animate = function(time) {
        TWEEN.update(time)
        frameHandler = requestAnimationFrame(animate)
      }

      const rating = { value: start }
      const tween = new TWEEN.Tween(rating)

      tween
        .to({ value: end }, this.duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          this.tweenedValue = rating.value
        })
        .onComplete(() => cancelAnimationFrame(frameHandler))
        .start()

      frameHandler = requestAnimationFrame(animate)
    }
  }
}
</script>

<style lang="scss" scoped>
.star-rating {
  display: flex;
}
</style>
