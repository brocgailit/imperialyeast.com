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
            :to="'/organic-yeast-strains/beer-styles/'"
            aria-current="page"
            >Beer Style</nuxt-link
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
import StrainList from '~/components/StrainList.vue'
export default {
  components: {
    StrainList
  },
  computed: {
    strains() {
      return this.style.recommended_strains
        ? this.style.recommended_strains.map(s => s.strains_id)
        : []
    }
  },
  async asyncData({ params, $axios }) {
    const { slug } = params
    const { data: style } = await $axios.$get(
      `items/beer_styles?single=1&filter[slug]=${slug}&fields=*.*,recommended_strains.strains_id.*.*,`
    )
    return { style }
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
    font-family: $family-heading;
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
