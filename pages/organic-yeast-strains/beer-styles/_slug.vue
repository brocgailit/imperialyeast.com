<template>
  <section class="beer-style-detail-page container">
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
            :to="'/organic-yeast-strains/beer-styles/' + style.name_slug + '/'"
            aria-current="page"
            >{{ style.name }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <article>
      <header>
        <h2>{{ style.category.name }}</h2>
        <h1>{{ style.name }}</h1>
        <dl class="bjcp-code">
          <dt><abbr title="Beer Judge Certification Program">BJCP</abbr></dt>
          <dd>{{ style.bjcp || 'NA' }}</dd>
        </dl>
      </header>
      <div class="style-description" v-html="style.description" />
      <div class="recommended-strains">
        <h3 class="title">Recommended Yeast Strains</h3>
        <div class="strain-list">
          <ul class="">
            <li
              v-for="strain of strains"
              :key="strain.strain.name_slug"
              class="strain"
            >
              <strain-card :strain="strain.strain">
                <!-- Suitability: -->
                <div class="strain-suitability">
                  <star-rating
                    class="star-rating"
                    :max="3"
                    :value="strain.suitability"
                    color="grey"
                  />
                  <span class="suitability-label">
                    {{ strain.suitability | suitability }}
                  </span>
                </div>
              </strain-card>
            </li>
          </ul>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import StrainCard from '~/components/StrainCard.vue'
import StarRating from '~/components/StarRating.vue'
export default {
  components: {
    StrainCard,
    StarRating
  },
  computed: {
    ...mapState({
      website: state => state.website
    }),
    strains() {
      return this.style.yeast ? this.style.yeast.map(s => s.value) : []
      // return []
    }
  },
  filters: {
    suitability(value) {
      if (value === 3) return 'Great Choice!'
      if (value === 2) return 'Good Choice'
      if (value === 1) return 'OK, special considerations'
      return 'Bad choice'
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
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.style.name,
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/${this.style.slug}`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios }) {
    const { slug } = params
    const [style] = await $axios.$get('/collections/get/beerStyles', {
      params: {
        simple: true,
        limit: 1,
        populate: 5,
        'filter[name_slug]': slug,
        rspc: 1
      }
    })
    return { style }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: this.website.canonicalURL + this.$route.path + '/'
        }
      ],
      title: `Yeast Strains for ${this.style.name}s | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.style.shortDescription
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
          content: this.style.shortDescription
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: `Yeast Strains for ${this.style.name}s`
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
          content: this.style.shortDescription
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: `Yeast Strains for ${this.style.name}s`
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
.beer-style-detail-page {
  header {
    text-align: center;
    line-height: 1;
    margin-bottom: $size-5;
  }
  h1 {
    font-size: $size-2;
    @include brand-font;
  }

  h2 {
    font-weight: $weight-black;
    text-transform: uppercase;
  }

  .bjcp-code {
    margin-top: $size-7;
    font-weight: $weight-bold;
    color: $grey;
    > * {
      display: inline;
    }
  }

  .style-description {
    h4,
    h5 {
      font-weight: $weight-black;
      text-transform: uppercase;
    }
    h4 {
      font-size: $size-4;
    }
    h5 {
      font-size: $size-5;
    }
    p {
      margin-bottom: $size-5;
    }
  }

  .recommended-strains {
    h3 {
      font-size: $size-5;
    }
    padding-bottom: $size-1;
  }

  .strain-list {
    padding: 0 $size-4;
    break-inside: avoid;
    page-break-inside: avoid;
    .strain {
      width: 100%;
      flex: 1 0 100%;
      padding: $size-7;
      transition: all 500ms ease-in-out;
      @include tablet {
        flex: 0 0 50%;
      }
      @include desktop {
        flex: 0 0 33%;
      }
      margin: 0;
    }

    .strain-suitability {
      display: flex;
      align-items: center;
      .star-rating {
        width: 100px;
      }
      .suitability-label {
        padding: 0 $size-7;
        text-transform: uppercase;
        font-size: $size-7;
        font-weight: $weight-bold;
        color: $dark;
      }
    }

    @include desktop {
      ul {
        display: flex;
        flex-wrap: wrap;
      }
    }
    @include mobile {
      padding: 0;
    }
  }
}
</style>
