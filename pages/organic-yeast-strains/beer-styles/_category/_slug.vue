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
        <li>
          <nuxt-link
            :to="
              '/organic-yeast-strains/beer-styles/' +
                style.category.name_slug +
                '/'
            "
            >{{ style.category.name }}</nuxt-link
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
        <dl v-if="style.bjcp" class="bjcp-code">
          <dt><abbr title="Beer Judge Certification Program">BJCP</abbr>:</dt>
          <dd>
            <a
              v-for="code of style.bjcp"
              :key="code"
              :href="code | bjcpLink"
              target="_blank"
              title="View style on BJCP.org"
            >
              {{ code }}
            </a>
          </dd>
        </dl>
      </header>
      <div class="style-description" v-html="style.description" />
      <div class="recommended-strains">
        <h3 class="title is-4">Recommended Yeast Strains</h3>
        <div v-if="strains.best && strains.best.length > 0" class="strain-list">
          <h4 class="strain-list-title">
            <span>Great Choice{{ strains.best.length > 1 ? 's' : '' }}</span>
          </h4>
          <ul>
            <li
              v-for="strain of strains.best"
              :key="strain.strain.name_slug"
              class="strain"
            >
              <strain-card :strain="strain.strain" />
            </li>
          </ul>
        </div>
        <div
          v-if="strains.better && strains.better.length > 0"
          class="strain-list"
        >
          <h4 class="strain-list-title">
            <span>Good Choice{{ strains.better.length > 1 ? 's' : '' }}</span>
          </h4>
          <ul>
            <li
              v-for="strain of strains.better"
              :key="strain.strain.name_slug"
              class="strain"
            >
              <strain-card :strain="strain.strain" />
            </li>
          </ul>
        </div>

        <div v-if="strains.good && strains.good.length > 0" class="strain-list">
          <h4 class="strain-list-title">
            <span>OK, special considerations</span>
          </h4>
          <ul>
            <li
              v-for="strain of strains.good"
              :key="strain.strain.name_slug"
              class="strain"
            >
              <strain-card :strain="strain.strain" />
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
export default {
  components: {
    StrainCard
  },
  filters: {
    bjcpLink(code) {
      const [parent] = code.match(/(\d+)/)
      return `http://www.bjcp.org/style/2015/${parent}/${code}/`
    }
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
          name: 'Beer Styles',
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: this.style.category.name,
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/${this.style.category.name_slug}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.style.name,
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/${
            this.style.category.name_slug
          }/${this.style.name_slug}/`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios, payload }) {
    const { slug } = params
    let style, allStrains
    if (payload) {
      style = payload.style
      allStrains = payload.strains
    } else {
      style = (await $axios.$post('/collections/get/beerStyles', {
        simple: true,
        limit: 1,
        populate: 5,
        filter: {
          name_slug: slug
        },
        rspc: 1
      }))[0]
      allStrains = await $axios.$post('/collections/get/strains', {
        simple: true,
        populate: 2,
        rspc: 1
      })
    }

    const suitability = (key, suitability) => {
      return allStrains
        .filter(
          strain => (strain[key] || []).findIndex(s => s._id === style._id) > -1
        )
        .map(strain => ({ strain, suitability }))
    }

    const strains = {
      best: suitability('styleBest', 3),
      better: suitability('styleBetter', 2),
      good: suitability('styleGood', 1)
    }

    return {
      style,
      strains
    }
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
    padding: $size-7;
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
    padding-bottom: $size-1;
  }

  .strain-list {
    padding: 0 $size-4;
    break-inside: avoid;
    page-break-inside: avoid;

    .strain-list-title {
      padding-left: $size-7;
      position: relative;
      font-weight: $weight-black;
      font-size: $size-5;
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
