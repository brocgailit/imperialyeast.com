<template>
  <div>
    <div id="component-container">
      <component
        :is="COMPONENTS.find(c => c.name === layout.component).ref"
        v-for="layout of page.layouts"
        :key="layout.id"
        :layout="layout"
      />
    </div>
    <nav class="search-filter container">
      <b-field label="SEARCH" label-for="strain-search" custom-class="is-small">
        <b-input
          id="strain-search"
          v-model="search"
          type="search"
          icon="search"
          placeholder="Names, descriptions, and keywords"
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
        <!-- <div class="product-variation-select">
          <b-checkbox v-model="productVariation" native-value="home">
            Homebrew
          </b-checkbox>
          <b-checkbox v-model="productVariation" native-value="pro">
            Probrew
          </b-checkbox>
        </div> -->
      </div>
      <transition name="fade-filters">
        <div
          v-if="showAdvancedFilters"
          class="filters"
          style="pointer-events: all"
        >
          <b-field label="Flocculation">
            <vue-slider
              v-model="flocculation"
              :data="flocculationLabels"
              :interval="1"
              :dot-size="[24, 24]"
              :event-type="sliderEventType"
              marks
              adsorb
              included
            ></vue-slider>
          </b-field>
          <b-field label="Attenuation">
            <vue-slider
              v-model="attenuation"
              :min="65"
              :max="100"
              :dot-size="[24, 24]"
              :event-type="sliderEventType"
              :marks="{
                '65': { label: '65%' },
                '70': { label: '70%' },
                '75': { label: '75%' },
                '80': { label: '80%' },
                '85': { label: '85%' },
                '90': { label: '90%' },
                '95': { label: '95%' },
                '100': { label: '100%' }
              }"
              :interval="5"
              included
            ></vue-slider>
          </b-field>
          <b-field label="Temperature">
            <vue-slider
              v-model="temperature"
              :min="45"
              :dot-size="[24, 24]"
              :event-type="sliderEventType"
              :marks="{ '45': { label: '45°F' }, '100': { label: '100°F' } }"
            ></vue-slider>
            <!-- 7.2 C / 37.8  -->
          </b-field>
          <button
            type="button"
            class="close-button"
            @click="showAdvancedFilters = false"
          >
            <fa-icon :icon="['fal', 'chevron-up']" size="2x" title="Close" />
          </button>
        </div>
      </transition>
    </nav>
    <section class="search-filter-results">
      <div class="strains container">
        <article
          v-for="(group, name) in groups"
          :key="group.id"
          class="strain-group"
        >
          <strain-list :strains="group.strains" :header-color="group.color">
            <nuxt-link
              :to="
                '/organic-yeast-strains/yeast-types/' + group.name_slug + '/'
              "
            >
              <h2 class="strain-group-name" :style="{ color: group.color }">
                <span v-if="group.namePlural">{{ group.namePlural }}</span>
                <span v-else>{{ name }}s</span>
              </h2>
            </nuxt-link>
          </strain-list>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'
import StrainList from '~/components/StrainList.vue'

const FILTER_DEFAULTS = {
  attenuation: [50, 100],
  temperature: [32, 100],
  flocculation: ['Very Low', 'Very High']
}

export default {
  name: 'YeastStrainsPage',
  components: {
    StrainList,
    VueSlider: () => import('vue-slider-component')
  },
  mixins: [page],
  data() {
    return {
      sliderEventType: 'touch',
      productVariation: ['home'],
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
        if (groups[strain.type.name]) {
          groups[strain.type.name].strains.push(strain)
        } else {
          groups[strain.type.name] = Object.assign({}, strain.type, {
            slug: strain.type.slug,
            name_plural: strain.type.name_plural,
            strains: [strain]
          })
        }
        return groups
      }, {})
    },
    // Debounce the things
    filteredStrains() {
      const searched = this.strains.filter(s => {
        const checks = [
          'name',
          'productCode',
          'shortDescription',
          'fullDescription',
          'compareTo',
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
        const home =
          this.productVariation.some(a => s.consumer === (a === 'home')) ||
          this.productVariation.length === 0
        const flocLevel = this.flocculationLabels
          .map(l => l.toLowerCase())
          .indexOf(s.flocculation.toLowerCase())
        const floc =
          flocLevel >= this.flocculationLabels.indexOf(this.flocculation[0]) &&
          flocLevel <= this.flocculationLabels.indexOf(this.flocculation[1])
        const atten =
          this.attenuation[0] <= s.attenuation.max &&
          this.attenuation[1] >= s.attenuation.min
        const temp =
          this.temperature[0] <= s.temperature.max &&
          this.temperature[1] >= s.temperature.min
        return home && floc && atten && temp
      })

      return filtered
    }
  },
  async asyncData({ params, $axios }) {
    const slug = 'organic-yeast-strains'
    const strains = await $axios.$get('/collections/get/strains', {
      params: {
        simple: true,
        'filter[public]': true,
        populate: 2,
        rspc: 1
      }
    })
    const [page] = await $axios.$get(`collections/get/pages`, {
      params: {
        'filter[name_slug]': slug,
        limit: 1,
        simple: true,
        populate: 12,
        rspc: 1
      }
    })
    return { page, strains }
  },
  mounted() {
    this.sliderEventType = window.matchMedia('(max-width: 768px)').matches
      ? 'touch'
      : 'mouse'
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

<style lang="scss">
$themeColor: $primary;
@import '~vue-slider-component/lib/theme/default.scss';
.search-filter-results {
  .strains {
    padding-bottom: $size-1;
    .strain-group {
      margin-bottom: $size-5;
    }
    .strain-group-name {
      padding-left: $size-7;
      position: relative;
      font-weight: $weight-black;
      font-size: $size-3;
      text-transform: uppercase;
      text-align: left;
      background-color: $white;
      margin: 0;
      span {
        position: relative;
        z-index: 1;
        background-color: $white;
        padding-right: $size-5;
      }
      &:after {
        content: '';
        position: absolute;
        left: $size-7;
        width: calc(100% - #{$size-7 * 2});
        background-color: rgba($grey, 0.25);
        height: 2px;
        top: 50%;
      }
    }
  }
}

.search-filter {
  z-index: 2;
  background-color: rgba($white, 0.9);
  backdrop-filter: blur(3px);
  padding: $size-7;
  margin-bottom: $size-5;
  .filters {
    transform-origin: top left;
    position: absolute;
    top: 100%;
    background-color: rgba($white, 0.8);
    backdrop-filter: blur(3px);
    left: $size-7;
    width: calc(100% - #{$size-7 * 2});
    border: 1px solid $light;
    padding: $size-5 $size-1 $size-1;
    .label {
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: $size-7;
      text-align: center;
    }
    .field:not(:last-child) {
      margin-bottom: $size-2;
    }
    .close-button {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      border: 0;
      outline: 0;
      background-color: lighten($light, 1%);
      margin: 0 auto;
      display: block;
      border-top: 1px solid $light;
      padding: 4px;
      color: $primary;
      cursor: pointer;
      &:hover {
        background-color: $light;
      }
    }
  }
  .product-variation-select {
    display: inline-block;
    margin-top: 5px;
    padding: 0 $size-7;
  }
}

@include mobile {
  .vue-slider-marks {
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
@include touch {
  .search-filter {
    position: sticky;
    top: $navbar-height-touch;
    border: 1px solid darken($light, 2%);
    border-width: 1px 0;
    margin-top: $size-7;
    background-color: lighten($light, 2%);
    .filters {
      padding: $size-5 $size-2 $size-2;
      .field:not(:last-child) {
        margin-bottom: $size-6;
      }
      .label {
        margin: 0;
        font-size: $size-7;
      }
      .vue-slider-mark-label {
        font-size: $size-7;
      }
    }
  }
}

.fade-filters-enter-active,
.fade-filters-leave-active {
  transition: 150ms ease-in-out;
  transform: scale(1);
}
.fade-filters-enter,
.fade-filters-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(-2rem);
}
</style>
