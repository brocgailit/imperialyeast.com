<template>
  <section class="hero-carousel">
    <ImageCarousel :slides="carousel" :duration="3500">
      <transition name="slide-up">
        <div v-show="mounted" class="container">
          <h1>{{ layout.heading }}</h1>
          <h2>{{ layout.subheading }}</h2>
          <layout-actions class="layout-actions" :actions="layout.actions" />
        </div>
      </transition>
    </ImageCarousel>
  </section>
</template>

<script>
import ImageCarousel from '~/components/ImageCarousel.vue'
export default {
  components: {
    ImageCarousel
  },
  props: {
    layout: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      mounted: false
    }
  },
  computed: {
    carousel() {
      return (this.layout.media || []).filter(
        m => m.file && m.file.type.startsWith('image')
      )
    }
  },
  mounted() {
    this.mounted = true
  }
}
</script>
<style lang="scss">
.hero-carousel {
  text-align: center;
  .container {
    max-width: $readability-width;
  }
  h1 {
    font-family: 'Oswald', $family-primary;
    font-size: $size-1 * 1.5;
    line-height: 1.1;
    font-weight: $weight-medium;
    text-transform: uppercase;
    color: $white;
  }

  h2 {
    color: $white;
    font-size: $size-4;
    font-weight: $weight-bold;
    margin-top: $size-3;
    line-height: 1.1;
  }

  .layout-actions {
    margin-top: $size-3;
  }
  @include mobile {
    .container {
      padding: $size-7;
      max-width: 100%;
    }
    h1 {
      font-size: $size-2;
    }
    h2 {
      font-size: $size-5;
    }

    .button {
      max-width: 100%;
    }
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: 750ms ease-out;
}
.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
