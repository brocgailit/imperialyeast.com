<template>
  <div class="strain-list">
    <slot />
    <transition-group name="flip-list" tag="ul">
      <li v-for="strain of strains" :key="strain.id" class="strain">
        <h3
          class="strain-name"
          :style="{ color: strain.strain_type.packaging_color }"
        >
          <nuxt-link
            :to="
              '/organic-yeast-strains/yeast-types/' +
                strain.strain_type.slug +
                '/' +
                strain.slug
            "
          >
            <span>{{ strain.product_code }} {{ strain.name }}</span>
          </nuxt-link>
          <nuxt-link to="/in-stock-or-your-order-ships-free">
            <b-tooltip
              v-if="strain.guaranteed_in_stock"
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
          {{ strain.short_description }}
        </p>
        <!-- <dl class="strain-detail">
          <dt class="strain-detail-name">
            <abbr title="Temperature">Temp</abbr>:
          </dt>
          <dd class="strain-detail-info">
            {{ strain.temperature_min }}–{{ strain.temperature_max }}°F
            {{ strain.temperature_min | celsius }}–{{
              strain.temperature_max | celsius
            }}°C
          </dd>
          <dt class="strain-detail-name">Flocculation:</dt>
          <dd class="strain-detail-info">
            {{ strain.flocculation | flocculation }}
          </dd>
          <dt class="strain-detail-name">Attenuation:</dt>
          <dd class="strain-detail-info">
            {{ strain.attenuation_min }}–{{ strain.attenuation_max }}%
          </dd>
        </dl> -->
        <div class="strain-actions">
          <nuxt-link
            :style="{ color: strain.strain_type.packaging_color }"
            class="is-small"
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
    </transition-group>
  </div>
</template>

<script>
import { Tooltip as BTooltip } from 'buefy/dist/components/tooltip'

export default {
  components: {
    BTooltip
  },
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
    width: 100%;
    flex: 1 0 100%;
    padding: $size-7;
    transition: all 500ms ease-in-out;
    @include tablet {
      flex: 0 0 50%;
    }
    @include desktop {
      flex: 0 0 33%;
    }
    margin: 0;
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
  }
  @include desktop {
    ul {
      display: flex;
      flex-wrap: wrap;
    }
  }
  @include mobile {
    padding: 0;
    .strain .strain-name {
      font-size: $size-5;
    }
  }
}

.flip-list-move {
  transition: transform 500ms ease-in-out;
}

.flip-list-enter, .flip-list-leave-to
/* .flip-list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.flip-list-leave-active {
  position: absolute;
}
</style>
