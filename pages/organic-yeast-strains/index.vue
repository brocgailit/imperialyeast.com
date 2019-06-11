<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
    <section>
      <div class="strains container">
        <article
          v-for="(group, name) in groups"
          :key="group.id"
          class="strain-group"
        >
          <h2
            class="strain-group-name"
            :style="{ color: group.packaging_color }"
          >
            {{ name }}
          </h2>
          <ul class="strain-list">
            <li
              v-for="strain of group.strains"
              :key="strain.key"
              class="strain"
            >
              <h3 class="strain-name" :style="{ color: group.packaging_color }">
                {{ strain.product_code }} {{ strain.name }}
              </h3>
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
            </li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'
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
  data() {
    return {
      DYNAMIC_COMPONENTS
    }
  },
  computed: {
    groups() {
      return this.strains.reduce((groups, strain) => {
        if (groups[strain.strain_type.name]) {
          groups[strain.strain_type.name].strains.push(strain)
        } else {
          groups[strain.strain_type.name] = Object.assign(
            {},
            strain.strain_type,
            {
              strains: [strain]
            }
          )
        }
        return groups
      }, {})
    }
  },
  async asyncData({ params, $axios }) {
    const slug = 'organic-yeast-strains'
    const fields = [
      '*.*',
      'layouts.*.*',
      'layouts.forms.fields.*',
      'layouts.forms.*'
    ]
    const strains = await $axios
      .$get(`items/strains?filter[status]=published&fields=*.*,strain_type.*`)
      .then(res => res.data)
    const page = await $axios
      .$get(
        `items/pages?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)
    return { page, strains }
  }
}
</script>

<style lang="scss" scoped>
.strains {
  columns: 500px;
  column-gap: $size-7;
  text-align: center;
  padding-bottom: $size-1;
  .strain-group-name {
    font-weight: $weight-black;
    font-size: $size-3;
    text-transform: uppercase;
  }
  .strain-list {
    padding: 0 $size-4;
    break-inside: avoid;
    page-break-inside: avoid;
    .strain {
      margin: $size-7 0;
      .strain-name {
        font-weight: $weight-bold;
        font-size: $size-5;
      }
      .strain-description {
        font-size: $size-6;
        margin: $size-7 0;
      }
      .strain-detail-name,
      .strain-detail-info {
        display: inline;
        text-transform: uppercase;
        color: $grey;
        font-family: $family-heading;
      }

      .strain-detail-name:not(:first-child):before {
        content: '// ';
      }
    }
  }
}
</style>
