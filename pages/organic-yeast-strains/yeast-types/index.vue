<template>
  <div class="strain-types-select">
    <h1>Select a Yeast Strain Family:</h1>
    <nav class="container">
      <ul class="strain-types">
        <li
          v-for="type of types"
          :key="type.id"
          class="strain-type"
          :style="{ 'background-color': type.packaging_color }"
          @click="
            $router.push('/organic-yeast-strains/yeast-types/' + type.slug)
          "
        >
          <h2>
            <nuxt-link :to="'/organic-yeast-strains/yeast-types/' + type.slug">
              <span v-if="type.name_plural">{{ type.name_plural }}</span>
              <span v-else>{{ type.name }}s</span>
            </nuxt-link>
          </h2>
          <p>
            {{ type.short_description }}
          </p>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      website: state => state.website
    })
  },
  async asyncData({ params, $axios }) {
    const types = await $axios
      .$get(`items/strain_types?filter[status]=published&fields=*.*`)
      .then(res => res.data)
    return { types }
  },
  head() {
    return {
      title: `Types of Yeast Strains | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${
            this.website.name
          } carries a wide variety of yeast strains for home and pro brewers.`
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
          content: `${
            this.website.name
          } carries a wide variety of yeast strains for home and pro brewers.`
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: 'Types of Yeast Strains'
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
          content: `${
            this.website.name
          } carries a wide variety of yeast strains for home and pro brewers.`
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: 'Types of Yeast Strains'
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
.strain-types-select {
  padding: $size-1 $size-7;
  h1 {
    margin: $size-5 0;
    font-size: $size-2;
    @include brand-font;
    text-align: center;
  }
  .strain-types {
    text-align: center;
    @include desktop {
      display: flex;
      flex-wrap: wrap;
    }
    .strain-type {
      cursor: pointer;
      flex: 1 0 calc(50% - #{$size-7 * 2});
      margin: $size-7;
      padding: $size-3 $size-5;
      color: $white;
      transition: transform 150ms ease-in-out;
      h2 {
        font-size: $size-2;
        font-weight: $weight-black;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        a {
          color: $white;
        }
      }

      &:hover {
        transform: translateY(-5px);
      }
    }
  }
  @include mobile {
    padding: $size-5 $size-7;
    h1 {
      font-size: $size-3;
    }
    .strain-types {
      .strain-type {
        h2 {
          font-size: $size-4;
        }
        p {
          font-size: $size-6;
        }
      }
    }
  }
}
</style>
