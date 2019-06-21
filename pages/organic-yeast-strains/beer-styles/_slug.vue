<template>
  <section class="beer-style-detail-page container">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains"
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
            :to="'/organic-yeast-strains/beer-styles/' + style.slug"
            aria-current="page"
            >{{ style.name }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <article>
      <header>
        <h2>{{ style.type }}</h2>
        <h1>{{ style.name }}</h1>
        <dl class="bjcp-code">
          <dt><abbr title="Beer Judge Certification Program">BJCP</abbr></dt>
          <dd>{{ style.judge_code || 'NA' }}</dd>
        </dl>
      </header>
      <div class="style-description" v-html="style.description" />
      <div class="recommended-strains">
        <h3>Recommended Yeast Strains</h3>
        <div class="strains">
          <strain-list :strains="strains" />
        </div>
      </div>
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
    }),
    strains() {
      return this.style.recommended_strains
        ? this.style.recommended_strains.map(s => s.strains_id)
        : []
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
          item: `${this.website.canonical_url}/organic-yeast-strains`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Beer Styles',
          item: `${
            this.website.canonical_url
          }/organic-yeast-strains/beer-styles/`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.style.name,
          item: `${
            this.website.canonical_url
          }/organic-yeast-strains/beer-styles/${this.style.slug}`
        }
      ]
    }
    return schema
  },
  async asyncData({ params, $axios }) {
    const { slug } = params
    const { data: style } = await $axios.$get(
      `items/beer_styles?single=1&filter[slug]=${slug}&fields=*.*,recommended_strains.strains_id.*.*,`
    )
    return { style }
  },
  head() {
    return {
      title: `Yeast Strains for ${this.style.name}s | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.style.short_description
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
          content: this.style.short_description
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: `Yeast Strains for ${this.style.name}s`
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
          content: this.style.short_description
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: `Yeast Strains for ${this.style.name}s`
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
      text-align: center;
      font-size: $size-5;
      text-transform: uppercase;
      font-weight: $weight-bold;
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
}
</style>
