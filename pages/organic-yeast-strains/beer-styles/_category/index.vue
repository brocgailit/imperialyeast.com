<template>
  <div class="beer-styles-category">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains/"
            >Organic Yeast Strains</nuxt-link
          >
        </li>
        <li>
          <nuxt-link to="/organic-yeast-strains/beer-styles/"
            >Beer Styles</nuxt-link
          >
        </li>
        <li class="is-active">
          <nuxt-link
            :to="'/organic-yeast-strains/beer-styles/' + category.name_slug"
            aria-current="page"
            >{{ category.name }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <section>
      <div class="container">
        <h1 class="title">{{ category.name }}</h1>
        <h2
          v-if="category.description"
          class="subtitle"
          v-html="category.description"
        />
        <ul class="style-list columns is-multiline">
          <li
            v-for="style of styles"
            :key="style._id"
            class="style-item column is-one-third"
          >
            <nuxt-link
              class="style-name"
              :to="
                '/organic-yeast-strains/beer-styles/' +
                  category.name_slug +
                  '/' +
                  style.name_slug
              "
            >
              {{ style.name }}
            </nuxt-link>
            <div class="content" v-html="style.description" />
            <nuxt-link
              class="style-link"
              :to="
                '/organic-yeast-strains/beer-styles/' +
                  category.name_slug +
                  '/' +
                  style.name_slug
              "
            >
              View Recommended Strains →
            </nuxt-link>
          </li>
        </ul>
      </div>
      <div class="container category-actions">
        <b-button
          to="/organic-yeast-strains/beer-styles/"
          tag="nuxt-link"
          icon-left="chevron-left"
          type="is-primary"
        >
          Explore Categories
        </b-button>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      website: state => state.website
    }),
    category() {
      return this.styles[0].category
    },
    header() {
      return this.page.layouts.find(l => l.component === 'hero')
    }
  },
  scrollToTop: true,
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
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.category.name,
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/${this.category.name_slug}/`
        }
      ]
    }
    return schema
  },
  /* TODO: NEED HEAD!!! */
  async asyncData({ params, $axios, payload }) {
    const { category } = params
    let styles
    if (payload) {
      styles = payload
    } else {
      styles = await $axios.$post('/collections/get/beerStyles', {
        simple: true,
        populate: 1,
        rspc: true,
        fields: {
          name: true,
          alternativeNames: true,
          description: true,
          bjcp: true,
          name_slug: true,
          _id: true,
          category: true
        }
      })
    }

    return {
      styles: styles
        .filter(s => s.category.name_slug === category)
        .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
    }
  }
}
</script>

<style lang="scss">
.beer-styles-category {
  .subtitle {
    text-transform: none;
  }
  .style-item {
    .style-name {
      font-weight: $weight-bold;
      font-size: $size-5;
    }
    .style-link {
      font-size: $size-8;
    }
    .content {
      font-size: $size-7;
      margin-bottom: 0;
    }
  }

  .category-actions {
    text-align: center;
    padding: $size-2 0;
  }
}
</style>
