<template>
  <div class="strain-beer-styles">
    <h3>{{ title }}</h3>
    <slot />
    <b-taglist class="styles-list">
      <b-tag
        v-for="style of styles.slice(0, 3)"
        :key="style.style.id"
        :size="style.suitability | size"
      >
        <nuxt-link
          :to="
            stylePath +
              style.style.category.name_slug +
              '/' +
              style.style.name_slug
          "
          class="has-text-whitex"
        >
          {{ style.style.name }}
        </nuxt-link>
      </b-tag>
    </b-taglist>
    <b-collapse
      v-if="styles.length > 3"
      :open="false"
      :aria-id="strain.name_slug + '-styles'"
    >
      <div
        slot="trigger"
        slot-scope="props"
        :aria-controls="strain.name_slug + '-styles'"
      >
        <span class="trigger-text">
          Show more recommended styles
        </span>
        <fa-icon
          :icon="['fal', 'chevron-right']"
          :class="{ 'fa-rotate-90': props.open }"
        />
      </div>
      <b-taglist class="styles-list">
        <b-tag
          v-for="style of styles.slice(3)"
          :key="style.style.id"
          type="is-primaryx"
          :size="style.suitability | size"
        >
          <nuxt-link
            :to="
              stylePath +
                style.style.category.name_slug +
                '/' +
                style.style.name_slug
            "
          >
            {{ style.style.name }}
          </nuxt-link>
        </b-tag>
      </b-taglist>
    </b-collapse>
  </div>
</template>
<script>
export default {
  filters: {
    size(suitability) {
      if (suitability === 1) return 'is-small'
      if (suitability === 3) return 'is-medium'
      return 'is-normal'
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
    },
    strain: {
      type: Object,
      default: () => null
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

  .collapse-trigger {
    font-size: $size-8;
    cursor: pointer;
    .trigger-text {
      margin-right: $size-7;
    }
  }
}
</style>
