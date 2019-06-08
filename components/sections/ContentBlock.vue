<template>
  <section class="content-block">
    <div class="container">
      <article>
        <header>
          <h3>{{ layout.heading }}</h3>
          <h4 v-if="layout.subheading">{{ layout.subheading }}</h4>
        </header>
      </article>
      <div class="image-container">
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
  computed: {
    images() {
      return (this.layout.media || []).filter(
        m => m.file && m.file.type.startsWith('image')
      )
    }
  }
}
</script>

<style lang="scss">
.content-block {
  padding: $size-1;
  header {
    text-align: center;
    color: $black;
  }
  h3 {
    font-family: $family-heading;
    font-size: $size-2;
  }
}
</style>
