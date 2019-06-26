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
          >
            <span v-if="type.name_plural">{{ type.name_plural }}</span>
            <span v-else>{{ type.name }}s</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
    <header class="container" :style="{ color: type.packaging_color }">
      <h1>{{ type.name }}s</h1>
      <h2 class="type-description-short">{{ type.short_description }}</h2>
    </header>
    <div
      v-if="type.full_description"
      class="type-description-full container"
      v-html="type.full_description"
    />
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
      `items/strains?filter[status]=published&filter[strain_type]=${
        type.id
      }&fields=*.*,beer_styles.*.*`
    )
    return { strains, type }
  },
  head() {
    return {
      title: `${this.type.name} Yeast Strains | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.type.short_description
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
          content: this.type.short_description
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: `${this.type.name} Yeast Strains`
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.website.default_sharing_image.data.url
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.website.default_sharing_image.title
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
          content: this.type.short_description
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: `${this.type.name} Yeast Strains`
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.website.default_sharing_image.data.url
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.strain-type {
  padding-bottom: $size-1;
  header {
    text-align: center;
    max-width: $readability-width;
    padding: 0 $size-7;
    h1 {
      font-weight: $weight-black;
      font-size: $size-1;
      text-transform: uppercase;
    }
    h2 {
      font-size: $size-5;
    }
    @include mobile {
      h1 {
        font-size: $size-2;
      }
    }
  }

  .strain-list ul {
    justify-content: center;
  }

  .type-description-full {
    padding: $size-5 $size-7;
  }
}
</style>
