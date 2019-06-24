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
      <b-field label="SEARCH" label-for="strain-search" custom-class="is-small">
        <b-input
          id="strain-search"
          v-model="search"
          type="search"
          icon="search"
          icon-pack="fal"
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
              marks
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
              :marks="{ '45': { label: '45℉' }, '100': { label: '100℉' } }"
            ></vue-slider>
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
          <strain-list
            :strains="group.strains"
            :header-color="group.packaging_color"
          >
            <nuxt-link :to="'/organic-yeast-strains/yeast-types/' + group.slug">
              <h2
                class="strain-group-name"
                :style="{ color: group.packaging_color }"
              >
                <span>{{ name }}s</span>
              </h2>
            </nuxt-link>
          </strain-list>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StrainList from '~/components/StrainList.vue'
import { Field as BField } from 'buefy/dist/components/field'
import { Input as BInput } from 'buefy/dist/components/input'
import { Checkbox as BCheckbox } from 'buefy/dist/components/checkbox'
import { Button as BButton } from 'buefy/dist/components/button'
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'

const FILTER_DEFAULTS = {
  attenuation: [50, 100],
  temperature: [32, 100],
  flocculation: ['Very Low', 'Very High']
}

export default {
  components: {
    StrainList,
    VueSlider: () => import('vue-slider-component'),
    BField,
    BInput,
    BButton,
    BCheckbox
  },
  data() {
    return {
      sliderEventType: 'touch',
      DYNAMIC_COMPONENTS,
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
  mounted() {
    this.sliderEventType = window.matchMedia('(max-width: 768px)').matches
      ? 'touch'
      : 'mouse'
  },
  computed: {
    ...mapState({
      website: state => state.website
    }),
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
    // Debounce the things
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
        const home =
          this.productVariation.some(
            a => s.home_availability === (a === 'home')
          ) || this.productVariation.length === 0
        const floc =
          s.flocculation >=
            this.flocculationLabels.indexOf(this.flocculation[0]) &&
          s.flocculation <=
            this.flocculationLabels.indexOf(this.flocculation[1])
        const atten =
          this.attenuation[0] <= s.attenuation_max &&
          this.attenuation[1] >= s.attenuation_min
        const temp =
          this.temperature[0] <= s.temperature_max &&
          this.temperature[1] >= s.temperature_min
        return home && floc && atten && temp
      })

      return filtered
    }
  },
  async asyncData({ params, $axios }) {
    const slug = 'organic-yeast-strains'
    const fields = ['*.*', 'layouts.*.*']
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
  },
  head() {
    return {
      title: `${this.page.title} | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description
        },
        {
          hid: 'open-graph-url',
          property: 'og:url',
          content: `${this.website.canonical_url}${this.$route.path}`
        },
        {
          hid: 'open-graph-type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'open-graph-description',
          property: 'og:description',
          content: this.page.description
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: this.page.title
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.data.url
            : this.website.default_sharing_image.data.url
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.title
            : this.website.default_sharing_image.title
        },
        {
          hid: 'twitter-card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter-site',
          property: 'twitter:site',
          content: `@${this.website.twitter_handle}`
        },
        {
          hid: 'twitter-description',
          property: 'twitter:description',
          content: this.page.description
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: this.page.title
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.data.url
            : this.website.default_sharing_image.data.url
        }
      ]
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
  z-index: 1070;
  background-color: rgba($white, 0.9);
  backdrop-filter: blur(10px);
  padding: $size-7;
  margin-bottom: $size-5;
  .filters {
    position: absolute;
    top: 100%;
    background-color: $white;
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
      background-color: lighten($light, 2%);
      margin: 0 auto;
      display: block;
      border-top: 1px solid $light;
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
  transition: opacity 150ms linear;
}
.fade-filters-enter,
.fade-filters-leave-to {
  opacity: 0;
}
</style>
