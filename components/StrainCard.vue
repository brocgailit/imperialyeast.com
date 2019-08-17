<template>
  <div class="strain-card">
    <h3 class="strain-name" :style="{ color: strain.type.color }">
      <nuxt-link
        :to="
          '/organic-yeast-strains/yeast-types/' +
            strain.type.name_slug +
            '/' +
            strain.name_slug +
            '/'
        "
      >
        <span>{{ strain.productCode }} {{ strain.name }}</span>
      </nuxt-link>
      <nuxt-link to="/in-stock-or-your-order-ships-free/">
        <b-tooltip
          v-if="strain.instock"
          style="vertical-align: middle"
          label="Guaranteed In Stock"
          position="is-top"
          animated
        >
          <fa-icon :icon="['fal', 'shipping-fast']" size="sm" />
        </b-tooltip>
      </nuxt-link>
    </h3>
    <p class="strain-description">
      {{ strain.shortDescription }}
    </p>

    <div>
      <slot />
    </div>
    <dl v-if="showDetail" class="strain-detail">
      <dt class="strain-detail-name"><abbr title="Temperature">Temp</abbr>:</dt>
      <dd class="strain-detail-info">
        {{ strain.temperature.min }}–{{ strain.temperature.max }}°F
        {{ strain.temperature.min | celsius }}–{{
          strain.temperature.max | celsius
        }}°C
      </dd>
      <dt class="strain-detail-name">Flocculation:</dt>
      <dd class="strain-detail-info">
        {{ strain.flocculation | flocculation }}
      </dd>
      <dt class="strain-detail-name">Attenuation:</dt>
      <dd class="strain-detail-info">
        {{ strain.attenuation.min }}–{{ strain.attenuation.max }}%
      </dd>
    </dl>
    <div class="strain-actions">
      <nuxt-link
        :style="{ color: strain.type.color }"
        class="is-small"
        :to="
          '/organic-yeast-strains/yeast-types/' +
            strain.type.name_slug +
            '/' +
            strain.name_slug +
            '/'
        "
        :title="'Learn more about ' + strain.name"
        >View Strain</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'StrainCard',
  props: {
    strain: {
      type: Object,
      default: () => null
    },
    showDetail: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.strain-card {
  .strain-name {
    font-weight: $weight-bold;
    font-size: $size-4;
    a {
      color: currentColor;
    }
  }
  .strain-description {
    font-size: $size-7;
    margin-bottom: $size-7;
  }
  .strain-detail-name,
  .strain-detail-info {
    font-size: $size-6;
    display: inline;
    text-transform: uppercase;
    color: $dark;
    @include brand-font;
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

  @include mobile {
    .strain .strain-name {
      font-size: $size-5;
    }
  }
}
</style>
