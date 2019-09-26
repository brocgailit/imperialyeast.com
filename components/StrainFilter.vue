<template>
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
      <span
        v-show="filteredStrains.length !== strains.length"
        class="filter-length-text"
      >
        Showing {{ filteredStrains.length }} strains
      </span>
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
</template>

<script>
import { component } from '~/assets/script/mixins'
const FILTER_DEFAULTS = {
  attenuation: [50, 100],
  temperature: [32, 100],
  flocculation: ['Very Low', 'Very High']
}
export default {
  name: 'YeastStrainFilter',
  components: {
    VueSlider: () => import('vue-slider-component')
  },
  mixins: [component],
  props: {
    strains: {
      type: Array,
      default: () => []
    },
    showCommercial: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sliderEventType: 'touch',
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
    searchedStrains() {
      return this.strains.filter(s => {
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
    },
    // Debounce the things
    filteredStrains() {
      const filtered = this.searchedStrains.filter(s => {
        const home = this.showCommercial ? true : s.consumer
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
      this.$emit('filter', filtered)
      return filtered
    }
  },
  mounted: function() {
    this.test = this.strains
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
.search-filter {
  z-index: 2;
  background-color: rgba($white, 0.9);
  backdrop-filter: blur(3px);
  padding: $size-7;
  margin-bottom: $size-5;

  .filter-length-text {
    float: right;
    font-size: $size-8;
    color: $grey;
  }
  // margin-top: -$size-4;
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
