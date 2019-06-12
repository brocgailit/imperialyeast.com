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
export default {
  components: {
    StrainList
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
              slug: strain.strain_type.slug,
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
</style>
