<template>
  <div>
    <strain-filter :strains="strains" @filter="updateStrains" />
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
import StrainFilter from '~/components/StrainFilter.vue'

export default {
  name: 'YeastStrainsHomebrewPage',
  components: {
    StrainList,
    StrainFilter
  },
  mixins: [page],
  data() {
    return {
      productVariation: ['home'],
      filteredStrains: []
    }
  },
  computed: {
    groups() {
      return this.filteredStrains.reduce((groups, strain) => {
        if (groups[strain.type.name]) {
          groups[strain.type.name].strains.push(strain)
        } else {
          groups[strain.type.name] = Object.assign({}, strain.type, {
            slug: strain.type.name_slug,
            name_plural: strain.type.name_plural,
            strains: [strain]
          })
        }
        return groups
      }, {})
    }
  },
  async asyncData({ params, $axios }) {
    const strains = await $axios.$get('/collections/get/strains', {
      params: {
        simple: true,
        'filter[public]': true,
        populate: 2,
        rspc: 1
      }
    })
    return { strains }
  },
  methods: {
    updateStrains(strains) {
      console.log('updating strains')
      this.filteredStrains = strains
    }
  }
}
</script>

<style lang="scss">
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
</style>
