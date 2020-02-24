<template>
  <div class="container strain-detail-page">
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
        <li>
          <nuxt-link
            :to="
              '/organic-yeast-strains/yeast-types/' +
                strain.type.name_slug +
                '/'
            "
          >
            <span v-if="strain.type.namePlural">{{
              strain.type.namePlural
            }}</span>
            <span v-else>{{ strain.type.name }}s</span>
          </nuxt-link>
        </li>
        <li class="is-active">
          <nuxt-link
            :to="
              '/organic-yeast-strains/yeast-types/' +
                strain.type.name_slug +
                '/' +
                strain.name_slug +
                '/'
            "
            aria-current="page"
            >{{ strain.name }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <div class="strain-detail-main">
      <section>
        <header class="container">
          <h2>
            <nuxt-link
              :to="'../' + strain.type.name_slug + '/'"
              :style="{ color: strain.type.color }"
              >{{ strain.type.name }}</nuxt-link
            >
          </h2>
          <h1>{{ strain.name }}</h1>
          <div
            class="strain-code"
            :style="{ 'background-color': strain.type.color }"
          >
            {{ strain.productCode }}
          </div>

          <div class="strain-details">
            <dl class="strain-detail">
              <dt class="strain-detail-name">
                <abbr title="Temperature">Temp</abbr>:
              </dt>
              <dd class="strain-detail-info">
                {{ strain.temperature.min }}–{{ strain.temperature.max
                }}<span class="degrees">F</span>
                <small
                  >({{ strain.temperature.min | celsius }}–{{
                    strain.temperature.max | celsius
                  }}<span class="degrees">C</span>)</small
                >
              </dd>
            </dl>
            <dl class="strain-detail">
              <dt class="strain-detail-name">Flocculation:</dt>
              <dd class="strain-detail-info">
                {{ strain.flocculation }}
              </dd>
            </dl>
            <dl class="strain-detail">
              <dt class="strain-detail-name">Attenuation:</dt>
              <dd class="strain-detail-info">
                {{ strain.attenuation.min }}–{{ strain.attenuation.max }}%
              </dd>
            </dl>
            <dl class="strain-detail">
              <dt class="strain-detail-name">Alcohol Tolerance:</dt>
              <dd class="strain-detail-info">
                <span v-if="strain.alcoholTolerance.min"
                  >{{ strain.alcoholTolerance.min }}–</span
                >
                {{ strain.alcoholTolerance.max }}%
              </dd>
            </dl>
          </div>
          <dl v-if="strain.species" class="strain-species">
            <dt>Species:</dt>
            <dd>{{ strain.species }}</dd>
          </dl>
        </header>
        <div>
          <p class="strain-description-short">
            {{ strain.shortDescription }}
          </p>

          <div
            class="strain-description-full"
            v-html="strain.fullDescription"
          />

          <p v-if="strain.instock" class="strain-instock">
            <nuxt-link to="/in-stock-or-your-order-ships-free"
              >Guaranteed In Stock</nuxt-link
            >
          </p>

          <div v-if="strain.profiles.length" class="strain-profiles-container">
            <h3>
              Yeast Strain Profiles:
            </h3>
            <b-taglist class="strain-profiles">
              <b-tag
                v-for="(profile, p) of strain.profiles"
                :key="p"
                type="is-primary"
              >
                <nuxt-link
                  :to="'/search/?q=' + profile"
                  class="has-text-white"
                  >{{ profile }}</nuxt-link
                >
              </b-tag>
            </b-taglist>
          </div>
          <strain-beer-styles
            v-if="styles.length"
            class="strain-styles-container"
            :styles="styles"
            :strain="strain"
            title="Recommended Beer Styles"
          />
        </div>
      </section>
      <aside>
        <div class="strain-availability">
          <h3>Availability</h3>
          <ul>
            <!-- TODO: Add a flag in CMS -->
            <li
              v-if="
                !strain.consumer && !strain.type.name_slug !== 'gluten-free'
              "
            >
              <fa-icon :icon="['fal', 'check']" />
              Commercial pitches, 10L and larger
            </li>
            <li v-else>
              <fa-icon :icon="['fal', 'check']" />
              Commercial pitches, 1L and larger
            </li>
            <li v-if="strain.consumer">
              <fa-icon :icon="['fal', 'check']" />
              Pitch Right Home Brew Pouches
              <responsive-image
                class="home-packaging"
                :path="(strain.image || strain.type.image).path"
                :alt="
                  strain.image ? strain.image.title : strain.type.image.title
                "
                sizes="150px"
                lazy
              />
            </li>
            <li v-else>
              <fa-icon :icon="['fal', 'phone']" />
              Commercial —
              <nuxt-link to="/contact/">Special Order Only</nuxt-link>
            </li>
          </ul>
        </div>
        <div v-if="similar.length">
          <h3>Similar Strains</h3>
          <ul>
            <li v-for="strain of similar" :key="strain.id">
              <nuxt-link
                :to="
                  '/organic-yeast-strains/yeast-types/' +
                    strain.type.name_slug +
                    '/' +
                    strain.name_slug +
                    '/'
                "
              >
                {{ strain.productCode }} {{ strain.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Ordering</h3>
          <ul>
            <li>
              <nuxt-link to="/where-to-buy/purchase-yeast-online/"
                >Online Retailers</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/where-to-buy/">Find a Retailer</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/contact/">Commercial Accounts</nuxt-link>
            </li>
          </ul>
        </div>
        <no-ssr>
          <social-sharing
            :url="website.canonicalURL + $route.path"
            :title="website.name + ' ' + strain.productCode + ' ' + strain.name"
            :description="strain.description"
            :quote="strain.name + ' — ' + strain.shortDescription"
            :hashtags="strain.profiles ? strain.profiles.join(',') : null"
            :twitter-user="website.twitter"
            inline-template
          >
            <div class="social-sharing-container">
              <h3>Share</h3>
              <div class="social-sharing-buttons">
                <network network="facebook">
                  <fa-icon :icon="['fab', 'facebook']" size="2x" />
                </network>
                <network network="twitter">
                  <fa-icon :icon="['fab', 'twitter']" size="2x" />
                </network>
                <network network="linkedin">
                  <fa-icon :icon="['fab', 'linkedin']" size="2x" />
                </network>
                <network network="reddit">
                  <fa-icon :icon="['fab', 'reddit']" size="2x" />
                </network>
                <!-- <network network="sms" class="is-hidden-desktop">
                  <fa-icon :icon="['fal', 'comment-alt-lines']" size="2x" />
                </network> -->
                <network network="email">
                  <fa-icon :icon="['fal', 'envelope']" size="2x" />
                </network>
              </div>
            </div>
          </social-sharing>
        </no-ssr>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StrainBeerStyles from '~/components/StrainBeerStyles.vue'
export default {
  components: {
    StrainBeerStyles
  },
  scrollToTop: true,
  filters: {
    celsius: f => Math.round(((f - 32) * 5) / 9)
  },
  computed: {
    ...mapState({
      website: state => state.website
    }),
    sharingImage() {
      return (
        this.strain.image ||
        (!this.strain.consumer
          ? this.website.defaultSharingImages.commercial
          : this.website.defaultSharingImages.home)
      )
    },
    styles() {
      return [
        ...(this.strain.styleBest || []).map(style => ({
          style,
          suitability: 3
        })),
        ...(this.strain.styleBetter || []).map(style => ({
          style,
          suitability: 2
        })),
        ...(this.strain.styleGood || []).map(style => ({
          style,
          suitability: 1
        }))
      ]
    },
    similar() {
      return this.strain.similar ? this.strain.similar : []
    }
  },
  jsonld() {
    const breadcrumb = {
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
          name: this.strain.type.name,
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/${this.strain.type.name_slug}`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: this.strain.name,
          item: `${
            this.website.canonicalURL
          }/organic-yeast-strains/beer-styles/${this.strain.type.name_slug}/${
            this.strain.name_slug
          }`
        }
      ]
    }

    const product = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.strain.name,
      description: this.strain.shortDescription,
      sku: this.strain.productCode,
      brand: {
        '@type': 'Thing',
        name: this.website.title
      },
      // TODO: reviews!!!
      // TODO: aggregate ratings!!!
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: this.strain.low_price || this.strain.type.low_price,
        highPrice: this.strain.high_price || this.strain.type.high_price,
        priceCurrency: 'USD',
        offerCount: 1
      }
    }

    if (this.strain.gtin) {
      product.gtin13 = this.strain.gtin.padStart(13, '0')
    }

    if (this.strain.image || this.strain.type.image) {
      product.image = [[500, 500], [1024, 768], [1280, 720]].map(([w, h]) =>
        this.$options.filters.asset(
          (this.strain.image || this.strain.type.image).path,
          { w, h, fit: 'crop' }
        )
      )
    }

    return [breadcrumb, product]
  },
  async asyncData({ params, $axios, payload }) {
    const { slug } = params
    if (payload) {
      return { strain: payload }
    }
    const [strain] = await $axios.$post('/collections/get/strains', {
      simple: true,
      populate: 2,
      limit: 1,
      rspc: 1,
      filter: {
        name_slug: slug
      }
    })
    return { strain }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: this.website.canonicalURL + this.$route.path + '/'
        }
      ],
      title: `${this.strain.name} - ${this.strain.productCode} (${
        this.strain.type.name
      } Yeast) | ${this.website.title}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.strain.shortDescription
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
          content: this.strain.shortDescription
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: `${this.website.title} ${this.strain.productCode} ${
            this.strain.name
          }`
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.$options.filters.asset(this.sharingImage.path)
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.sharingImage.title
        },
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
          content: this.strain.shortDescription
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: `${this.strain.name} Yeast Strains`
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.$options.filters.asset(this.sharingImage.path)
        }
      ]
    }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/elements/tag';
@import '~buefy/src/scss/components/_tag';

.strain-detail-page {
  padding: 0 $size-7 $size-1;
  .strain-detail-main {
    display: flex;
    aside {
      padding: $size-5;
      margin: 0 $size-5;
      flex: 0 0 350px;
      h3 {
        letter-spacing: 0.1em;
        font-weight: $weight-bold;
        text-transform: uppercase;
        font-size: $size-7;
      }
      > *:not(:last-child) {
        margin-bottom: $size-5;
      }

      .strain-availability {
        picture {
          display: block;
          text-align: center;
        }
      }
    }
    section {
      flex-grow: 1;
      header {
        text-align: center;
        line-height: 1.1;
        h2 {
          font-weight: $weight-black;
          font-size: $size-5;
          text-transform: uppercase;
        }
        h1 {
          font-weight: $weight-black;
          font-size: $size-2;
        }
        @include mobile {
          h1 {
            font-size: $size-4;
          }
        }
      }

      .strain-code {
        $size: 100px;
        background-color: $black;
        width: $size;
        height: $size;
        margin: 0 auto;
        border-radius: 100%;
        color: $white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $size-3;
        @include brand-font;
        border: 5px solid $white;
      }

      .strain-description-short .strain-description-full {
        max-width: $readability-width;
        margin: 0 auto;
      }
      .strain-description-short {
        font-size: $size-5;
        text-align: center;
        margin: $size-2 0;
      }
      .strain-description-full {
        font-size: $size-6;
        p {
          margin-bottom: $size-5;
        }
      }

      .strain-instock {
        text-align: center;
        font-weight: $weight-bold;
        margin-top: $size-5;
        font-size: $size-5;
      }

      .strain-profiles-container {
        h3 {
          font-weight: $weight-bold;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: $size-7;
          line-height: 1;
        }
        .strain-profiles {
          justify-content: center;
        }
      }
      .strain-profiles-container,
      .strain-styles-container {
        margin-top: $size-3;
      }

      .strain-species {
        margin-top: $size-3;
        text-align: center;
        dt {
          font-weight: $weight-bold;
          text-align: center;
          text-transform: uppercase;
        }
        dd {
          font-size: $size-6;
          font-style: italic;
        }
      }
      .strain-details {
        margin: $size-5 0;
        .degrees {
          &:before {
            display: inline-block;
            content: '°';
            font-size: 90%;
            font-family: $family-primary;
            font-weight: $weight-bold;
            vertical-align: top;
            padding: 1px 0 0 1px;
          }
        }
        small .degrees:before {
          font-size: 85%;
          padding-top: 2px;
        }
        .strain-detail {
          display: inline-block;
          text-transform: uppercase;
          color: $grey;
          @include brand-font;
          .strain-detail-name,
          .strain-detail-info {
            display: inline;
          }

          &:not(:last-child):after {
            content: '// ';
            margin: 0 4px;
          }
          @include tablet {
            font-size: $size-5;
          }
        }
      }
    }

    @include mobile {
      flex-wrap: wrap;
      padding: 0 $size-7;
      aside {
        margin: $size-7 0;
        flex: 1 0 100%;
      }
    }

    .social-sharing-container {
      h3 {
        text-transform: uppercase;
        font-weight: $weight-bold;
        margin-bottom: 4px;
      }
      .social-sharing-buttons > * {
        margin: $size-7 / 2;
        cursor: pointer;
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
