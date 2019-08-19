<template>
  <div class="strain-beer-styles">
    <h3>{{ title }}</h3>
    <slot />
    <b-taglist class="styles-list">
      <b-tag
        v-for="style of styles"
        :key="style.style.id"
        type="is-primaryx"
        :size="style.suitability | size"
      >
        <nuxt-link
          :to="stylePath + style.style.name_slug"
          class="has-text-whitex"
        >
          {{ style.style.name }}
        </nuxt-link>
      </b-tag>
    </b-taglist>
  </div>
</template>
<script>
export default {
  filters: {
    size(suitability) {
      if (suitability === 1) return 'is-small'
      if (suitability === 3) return 'is-large'
      return 'is-medium'
    }
  },
  props: {
    styles: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: 'Beer Styles'
    },
    stylePath: {
      type: String,
      default: '/organic-yeast-strains/beer-styles/'
    }
  }
}
</script>
<style lang="scss">
.strain-beer-styles {
  padding: $size-6 0;
  text-align: center;
  h3 {
    font-weight: $weight-bold;
    text-transform: uppercase;
  }
  .styles-list {
    justify-content: center;
    margin-top: $size-6;
    .tag.is-large {
      font-weight: bold;
    }
  }
}
</style>
