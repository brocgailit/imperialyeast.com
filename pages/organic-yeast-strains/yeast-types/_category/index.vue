<template>
  <section class="strain-type">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains"
            >Organic Yeast Strains</nuxt-link
          >
        </li>

        <li>
          <nuxt-link to="/organic-yeast-strains/yeast-types"
            >Yeast Types</nuxt-link
          >
        </li>
        <li class="is-active">
          <nuxt-link
            :to="'/organic-yeast-strains/yeast-types/' + type.slug"
            aria-current="page"
            >{{ type.name }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <header class="container" :style="{ color: type.packaging_color }">
      <h1>{{ type.name }}</h1>
    </header>
    <article class="strains container">
      <strain-list :strains="strains" :header-color="type.packaging_color" />
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import StrainList from '~/components/StrainList.vue'
export default {
  components: {
    StrainList
  },
  computed: {
    ...mapState({
      website: state => state.website
    })
  },
  jsonld() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Organic Yeast Strains',
          item: `${this.website.canonical_url}/organic-yeast-strains`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Yeast Types',
          item: `${
            this.website.canonical_url
          }/organic-yeast-strains/yeast-types`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.type.name,
          item: `${
            this.website.canonical_url
          }/organic-yeast-strains/beer-styles/${this.type.slug}`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios }) {
    const { category } = params
    const { data: type } = await $axios.$get(
      `items/strain_types?single=1&filter[slug]=${category}`
    )
    const { data: strains } = await $axios.$get(
      `items/strains?filter[strain_type]=${type.id}&fields=*.*,beer_styles.*.*`
    )
    return { strains, type }
  }
}
</script>

<style lang="scss">
.strain-type {
  header {
    text-align: center;
    h1 {
      font-weight: $weight-black;
      font-size: $size-1;
      text-transform: uppercase;
    }
  }

  .strains {
    .strain-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .strain {
        text-align: center;
        flex: 0 0 50%;
        padding: $size-6;
      }
    }
    padding-bottom: $size-1;
  }
}
</style>
