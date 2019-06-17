<template>
  <div>
    <div id="component-container">
      <component
        :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
        v-for="layout of page.layouts"
        :key="layout.id"
        :layout="layout"
      />
    </div>
    <nav class="search-filter container">
      <b-field label="Search">
        <b-input
          v-model="search"
          type="search"
          icon="search"
          placeholder="Names, product codes, descriptions, and keywords"
          @input="handleSearchInput"
        ></b-input>
      </b-field>
      <div class="filter-actions">
        <b-button
          type="is-small"
          @click="showAdvancedFilters = !showAdvancedFilters"
          >{{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced</b-button
        >
        <b-button type="is-small" @click="clearFilters">Reset</b-button>
      </div>
      <div v-if="showAdvancedFilters" class="filters">
        <b-field label="Flocculation">
          <vue-slider
            v-model="flocculation"
            :min="0"
            :max="7"
            :data="flocculationLabels"
            :interval="1"
            marks
            adsorb
            included
          ></vue-slider>
        </b-field>
        <b-field label="Attenuation">
          <vue-slider
            v-model="attenuation"
            :min="50"
            :max="100"
            marks
            :interval="5"
            included
          ></vue-slider>
        </b-field>
        <b-field label="Temperature">
          <vue-slider
            v-model="temperature"
            :min="32"
            :max="100"
            :marks="{ '0': { label: '32℉' }, '100': { label: '100℉' } }"
          ></vue-slider>
        </b-field>
      </div>
    </nav>
    <section id="search-results">
      <div class="strains container">
        <article
          v-for="(group, name) in groups"
          :key="group.id"
          class="strain-group"
        >
          <strain-list
            :strains="group.strains"
            :header-color="group.packaging_color"
          >
            <nuxt-link :to="'/organic-yeast-strains/yeast-types/' + group.slug">
              <h2
                class="strain-group-name"
                :style="{ color: group.packaging_color }"
              >
                {{ name }}
              </h2>
            </nuxt-link>
          </strain-list>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import StrainList from '~/components/StrainList.vue'
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'

const FILTER_DEFAULTS = {
  attenuation: [50, 100],
  temperature: [32, 100],
  flocculation: ['Very Low', 'Very High']
}

export default {
  components: {
    StrainList
  },
  data() {
    return {
      DYNAMIC_COMPONENTS,
      search: '',
      showAdvancedFilters: false,
      attenuation: FILTER_DEFAULTS.attenuation,
      temperature: FILTER_DEFAULTS.temperature,
      flocculation: FILTER_DEFAULTS.flocculation,
      flocculationLabels: [
        'Very Low',
        'Low',
        'Medium-Low',
        'Medium',
        'Medium-High',
        'High',
        'Very High'
      ]
    }
  },
  computed: {
    groups() {
      return this.filteredStrains.reduce((groups, strain) => {
        if (groups[strain.strain_type.name]) {
          groups[strain.strain_type.name].strains.push(strain)
        } else {
          groups[strain.strain_type.name] = Object.assign(
            {},
            strain.strain_type,
            {
              slug: strain.strain_type.slug,
              strains: [strain]
            }
          )
        }
        return groups
      }, {})
    },
    filteredStrains() {
      const searched = this.strains.filter(s => {
        const checks = [
          'name',
          'product_code',
          'short_description',
          'full_description',
          'compare_to',
          'profiles',
          'species'
        ]
        return checks
          .map(c => {
            if (!s[c]) return false
            if (Array.isArray(s[c])) {
              return s[c]
                .join()
                .toLowerCase()
                .includes(this.search.toLowerCase())
            }
            return s[c].toLowerCase().includes(this.search.toLowerCase())
          })
          .some(match => match)
      })

      const filtered = searched.filter(s => {
        return (
          s.flocculation >=
            this.flocculationLabels.indexOf(this.flocculation[0]) &&
          s.flocculation <=
            this.flocculationLabels.indexOf(this.flocculation[1]) &&
          (s.attenuation_min >= this.attenuation[0] &&
            s.attenuation_max <= this.attenuation[1]) &&
          (s.temperature_min >= this.temperature[0] &&
            s.temperature_max <= this.temperature[1])
        )
      })

      return filtered
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
  },
  methods: {
    clearFilters() {
      this.search = ''
      this.attenuation = FILTER_DEFAULTS.attenuation
      this.temperature = FILTER_DEFAULTS.temperature
      this.flocculation = FILTER_DEFAULTS.flocculation
    },
    handleSearchInput() {
      // scroll to top of list
      const { height } = document
        .getElementById('component-container')
        .getBoundingClientRect()
      window.scrollTo(0, height)
    }
  }
}
</script>

<style lang="scss" scoped>
.strains {
  columns: 400px;
  column-gap: $size-7;
  text-align: center;
  padding-bottom: $size-1;
  .strain-group-name {
    font-weight: $weight-black;
    font-size: $size-3;
    text-transform: uppercase;
  }
}

.search-filter {
  z-index: 1080;
  background-color: rgba($white, 0.9);
  backdrop-filter: blur(10px);
  padding: $size-7;
  margin-bottom: $size-5;
  position: sticky;
  top: $navbar-height-touch;
  .filters {
    margin-top: $size-5;
    border: 1px solid $light;
    padding: $size-5 $size-1 $size-1;
    .field:not(:last-child) {
      margin-bottom: $size-3;
    }
  }
}

@include mobile {
  ::v-deep .vue-slider-marks {
    .vue-slider-mark {
      display: none;
      &:first-child {
        display: block;
      }
      &:last-child {
        display: block;
      }
    }
  }
}
</style>
