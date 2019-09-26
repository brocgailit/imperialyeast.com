<template>
  <div>
    <div id="component-container">
      <component
        :is="
          COMPONENTS.find(c => c.name === $parent.page.layouts[0].component).ref
        "
        :layout="$parent.page.layouts[0]"
      />
      <nav class="strain-type-nav container">
        <ul>
          <li>
            <nuxt-link to="/organic-yeast-strains/homebrew/" class="nav-link">
              Homebrew
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/organic-yeast-strains/commercial/" class="nav-link">
              Commercial
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
    <strain-filter :strains="strains" @filter="updateStrains" />
    <div v-if="page && page.layouts">
      <component
        :is="COMPONENTS.find(c => c.name === layout.component).ref"
        v-for="layout of page.layouts"
        :key="layout.id"
        :layout="layout"
      />
    </div>
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
      productVariation: ['home']
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
            namePlural: strain.type.namePlural,
            strains: [strain]
          })
        }
        return groups
      }, {})
    }
  },
  async asyncData({ params, $axios }) {
    const [page] = await $axios.$post(`collections/get/pages`, {
      filter: {
        name_slug: 'homebrew-strains'
      },
      limit: 1,
      simple: true,
      populate: 12,
      rspc: 1
    })
    const strains = await $axios.$post('/collections/get/strains', {
      simple: true,
      filter: {
        public: true
      },
      sort: {
        productCode: 1
      },
      populate: 2,
      rspc: 1
    })
    return { strains, filteredStrains: strains, page }
  },
  methods: {
    updateStrains(strains) {
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
