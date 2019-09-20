<template>
  <section class="strain-type">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains/"
            >Organic Yeast Strains</nuxt-link
          >
        </li>

        <li>
          <nuxt-link to="/organic-yeast-strains/yeast-types/"
            >Yeast Types</nuxt-link
          >
        </li>
        <li class="is-active">
          <nuxt-link
            :to="'/organic-yeast-strains/yeast-types/' + type.name_slug"
            aria-current="page"
          >
            <span v-if="type.namePlural">{{ type.namePlural }}</span>
            <span v-else>{{ type.name }}s</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
    <header class="container" :style="{ color: type.color }">
      <h1 v-if="type.namePlural">{{ type.namePlural }}</h1>
      <h1 v-else>{{ type.name }}s</h1>
      <h2 class="type-description-short">{{ type.short_description }}</h2>
    </header>
    <div
      v-if="type.fullDescription"
      class="type-description-full container"
      v-html="type.fullDescription"
    />
    <article class="strains container">
      <strain-list :strains="strains" :header-color="type.color" />
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
          item: `${this.website.canonicalURL}/organic-yeast-strains`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Yeast Types',
          item: `${this.website.canonicalURL}/organic-yeast-strains/yeast-types`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.type.name,
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/${this.type.name_slug}`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios, payload }) {
    let type
    if (payload) {
      type = payload
    } else {
      const { category } = params
      type = (await $axios.$post('/collections/get/strainTypes', {
        simple: true,
        populate: 2,
        limit: 1,
        filter: {
          name_slug: category
        },
        rspc: 1
      }))[0]
    }
    const strains = await $axios.$post('/collections/get/strains', {
      simple: true,
      populate: 2,
      filter: {
        'type._id': type._id
      },
      rspc: 1
    })
    return { strains, type }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: this.website.canonicalURL + this.$route.path + '/'
        }
      ],
      title: `${this.type.name} Yeast Strains | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.type.shortDescription
        },
        {
          hid: 'open-graph-url',
          property: 'og:url',
          content: `${this.website.canonicalURL}${this.$route.path}`
        },
        {
          hid: 'open-graph-type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'open-graph-description',
          property: 'og:description',
          content: this.type.shortDescription
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: `${this.type.name} Yeast Strains`
        },
        /* {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.website.default_sharing_image.data.url
        }, */
        /* {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.website.default_sharing_image.title
        }, */
        {
          hid: 'twitter-card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter-site',
          property: 'twitter:site',
          content: `@${this.website.twitter}`
        },
        {
          hid: 'twitter-description',
          property: 'twitter:description',
          content: this.type.shortDescription
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: `${this.type.name} Yeast Strains`
        }
        /* {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.website.default_sharing_image.data.url
        } */
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
