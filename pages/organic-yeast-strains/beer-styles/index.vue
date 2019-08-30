<template>
  <div class="beer-styles-page">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains/"
            >Organic Yeast Strains</nuxt-link
          >
        </li>
        <li class="is-active">
          <nuxt-link
            to="/organic-yeast-strains/beer-styles/"
            aria-current="page"
            >Beer Styles</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <component
      :is="COMPONENTS.find(c => c.name === header.component).ref"
      :layout="header"
    />
    <section>
      <div class="container">
        <ul>
          <li
            v-for="category of categories"
            :key="category._id"
            class="style-category"
          >
            <h3 class="title">
              <nuxt-link
                :to="
                  '/organic-yeast-strains/beer-styles/' +
                    category.name_slug +
                    '/'
                "
              >
                {{ category.name }}
              </nuxt-link>
            </h3>
            <div
              v-if="category.description"
              class="content category-description"
              v-html="category.description"
            />
            <div class="styles-link">
              <nuxt-link
                :to="
                  '/organic-yeast-strains/beer-styles/' +
                    category.name_slug +
                    '/'
                "
              >
                View Styles →
              </nuxt-link>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="layout of page.layouts.filter(
        l => l.component !== header.component
      )"
      :key="layout.id"
      :layout="layout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { page } from '~/assets/script/mixins'
export default {
  mixins: [page],
  computed: {
    ...mapState({
      website: state => state.website
    }),
    header() {
      return (
        this.page.layouts.find(l => l.component === 'hero') ||
        this.page.layouts[0]
      )
    }
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
          item: `${this.website.canonicalURL}/organic-yeast-strains`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Beer Styles',
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios }) {
    const slug = 'beer-styles'
    const [page] = await $axios.$post(`collections/get/pages`, {
      filter: {
        name_slug: slug
      },
      limit: 1,
      simple: true,
      populate: 12,
      rspc: true
    })
    const categories = await $axios.$post('/collections/get/beerCategories', {
      simple: true,
      rspc: true,
      fields: {
        name: true,
        name_slug: true,
        description: true
      }
    })
    return { categories, page }
  }
}
</script>

<style lang="scss">
.beer-styles-page {
  .style-category {
    margin-bottom: $size-5;
    .title {
      margin-bottom: 4px;
    }
    .category-description {
      text-align: center;
      margin: $size-8 0;
    }
    .styles-link {
      text-align: center;
      font-size: $size-7;
    }
  }
}
</style>
