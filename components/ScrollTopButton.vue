<template>
  <transition name="slide-up">
    <no-ssr>
      <button
        v-show="scrollPercent > 0.2"
        class="scroll-to-top"
        @click="scrollToTop"
      >
        <fa
          :icon="['fal', 'arrow-up']"
          size="2x"
          title="Scroll to Top of Page"
        />
      </button>
    </no-ssr>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      scrollPercent: 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.calcScrollPercent)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.calcScrollPercent)
  },
  methods: {
    calcScrollPercent() {
      const h = document.documentElement
      const b = document.body
      const st = 'scrollTop'
      const sh = 'scrollHeight'
      this.scrollPercent =
        (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)
    },
    scrollToTop() {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-to-top {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 3px solid $light;
  border-radius: 100%;
  width: 65px;
  height: 65px;
  color: $light;
  transition: 150ms;
  &:hover {
    color: $grey;
    background-color: $light;
  }
}
</style>
