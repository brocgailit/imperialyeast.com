<template>
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <defs>
      <linearGradient :id="id" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop
          offset="0%"
          class="gradient-stop gradient-stop-active"
          :style="{ 'stop-color': 'var(--' + color + ')' }"
        />
        <stop
          :offset="offset"
          class="gradient-stop gradient-stop-active"
          :style="{ 'stop-color': 'var(--' + color + ')' }"
        />
        <stop :offset="offset" class="gradient-stop gradient-stop-inactive" />
      </linearGradient>
    </defs>
    <polygon
      points="50,9 60.5,39.5 92.7,40.1 67,59.5 76.4,90.3 50,71.9 23.6,90.3 32.9,59.5 7.2,40.1 39.4,39.5"
      :fill="'url(#' + id + ')'"
    />
  </svg>
</template>

<script>
export default {
  name: 'StarRatingStar',
  props: {
    percent: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      id: 'gradient-' + Math.floor(new Date().getTime() * Math.random())
    }
  },
  computed: {
    offset() {
      return this.percent * 100 + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/component.scss';
.gradient-stop {
  stop-opacity: 1;
  stop-color: rgb(255, 145, 0);
}
.gradient-stop-inactive {
  stop-color: rgba($grey, 0.25);
}
</style>
