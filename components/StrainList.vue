<template>
  <div class="strain-list">
    <slot />
    <ul>
      <li v-for="strain of strains" :key="strain.key" class="strain">
        <nuxt-link
          :to="
            '/organic-yeast-strains/yeast-types/' +
              strain.strain_type.slug +
              '/' +
              strain.slug
          "
        >
          <h3
            class="strain-name"
            :style="{ color: strain.strain_type.packaging_color }"
          >
            {{ strain.product_code }} {{ strain.name }}
          </h3>
        </nuxt-link>
        <p class="strain-description">
          {{ strain.short_description }}
        </p>
        <dl class="strain-detail">
          <dt class="strain-detail-name">
            <abbr title="Temperature">Temp</abbr>:
          </dt>
          <dd class="strain-detail-info">
            {{ strain.temperature_min }}–{{ strain.temperature_max }}℉
            {{ strain.temperature_min | celsius }}–{{
              strain.temperature_max | celsius
            }}℃
          </dd>
          <dt class="strain-detail-name">Flocculation:</dt>
          <dd class="strain-detail-info">
            {{ strain.flocculation | flocculation }}
          </dd>
          <dt class="strain-detail-name">Attenuation:</dt>
          <dd class="strain-detail-info">
            {{ strain.attenuation_min }}–{{ strain.attenuation_max }}%
          </dd>
        </dl>
        <div class="strain-actions">
          <nuxt-link
            class="has-text-primary is-small"
            :to="
              '/organic-yeast-strains/yeast-types/' +
                strain.strain_type.slug +
                '/' +
                strain.slug
            "
            :title="'Learn more about ' + strain.name"
            >View Strain</nuxt-link
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  filters: {
    celsius: f => Math.round(((f - 32) * 5) / 9),
    flocculation(val) {
      return [
        'Very Low',
        'Low',
        'Med-Low',
        'Medium',
        'Med-High',
        'High',
        'Very High'
      ][val]
    }
  },
  props: {
    strains: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.strain-list {
  padding: 0 $size-4;
  break-inside: avoid;
  page-break-inside: avoid;
  .strain {
    margin: $size-7 0 $size-3;
    .strain-name {
      font-weight: $weight-bold;
      font-size: $size-4;
    }
    .strain-description {
      font-size: $size-6;
      margin-bottom: $size-7;
    }
    .strain-detail-name,
    .strain-detail-info {
      font-size: $size-7;
      display: inline;
      text-transform: uppercase;
      color: $grey;
      font-family: $family-heading;
    }

    .strain-detail-name:not(:first-child):before {
      content: '// ';
    }

    .strain-actions {
      margin-top: $size-7;
      a {
        text-transform: uppercase;
        font-size: $size-7;
        font-weight: $weight-bold;
        &:after {
          content: '→';
          padding-left: 0.5em;
          margin-right: -1rem;
        }
      }
    }
  }
}
</style>
