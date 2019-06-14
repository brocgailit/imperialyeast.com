<template>
  <div class="container">
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
        <li>
          <nuxt-link
            :to="
              '/organic-yeast-strains/yeast-types/' + strain.strain_type.slug
            "
            >{{ strain.strain_type.name }}</nuxt-link
          >
        </li>
        <li class="is-active">
          <nuxt-link
            :to="
              '/organic-yeast-strains/yeast-types/' +
                strain.strain_type.slug +
                '/' +
                strain.slug
            "
            aria-current="page"
            >{{ strain.name }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <div class="strain-detail-page">
      <section>
        <header class="container">
          <h2 :style="{ color: strain.strain_type.packaging_color }">
            {{ strain.strain_type.name }}
          </h2>
          <h1>{{ strain.name }}</h1>
          <div
            class="strain-code"
            :style="{ 'background-color': strain.strain_type.packaging_color }"
          >
            {{ strain.product_code }}
          </div>

          <dl class="strain-detail">
            <dt class="strain-detail-name">
              <abbr title="Temperature">Temp</abbr>:
            </dt>
            <dd class="strain-detail-info">
              {{ strain.temperature_min }}–{{ strain.temperature_max }}℉
              <small
                >({{ strain.temperature_min | celsius }}–{{
                  strain.temperature_max | celsius
                }}℃)</small
              >
            </dd>
            <dt class="strain-detail-name">Flocculation:</dt>
            <dd class="strain-detail-info">
              {{ strain.flocculation | flocculation }}
            </dd>
            <dt class="strain-detail-name">Attenuation:</dt>
            <dd class="strain-detail-info">
              {{ strain.attenuation_min }}–{{ strain.attenuation_max }}%
            </dd>
            <dt class="strain-detail-name">Alohol Tolerance:</dt>
            <dd class="strain-detail-info">
              <span v-if="strain.alcohol_tolerance_min"
                >{{ strain.alcohol_tolerance_min }}–</span
              >
              {{ strain.alcohol_tolerance }}%
            </dd>
          </dl>

          <dl v-if="strain.species" class="strain-species">
            <dt>Species:</dt>
            <dd>{{ strain.species }}</dd>
          </dl>
        </header>
        <div>
          <p class="strain-description-short">
            {{ strain.short_description }}
          </p>

          <div
            class="strain-description-full"
            v-html="strain.full_description"
          />

          <p v-if="strain.guaranteed_in_stock" class="strain-instock">
            <nuxt-link to="/in-stock-or-your-order-ships-free"
              >Guaranteed In Stock or your order ships FREE!</nuxt-link
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
                {{ profile }}
              </b-tag>
            </b-taglist>
          </div>
        </div>
      </section>
      <aside>
        <div class="strain-availability">
          <h3>Availability</h3>
          <div v-if="strain.home_availability">
            <p>Available in Pitch Right Home Brew Pouches</p>
            <responsive-image
              class="home-packaging"
              :file="strain.strain_type.home_packaging_image"
              :alt="strain.strain_type.home_packaging_image.description"
              sizes="150px"
              lazy
            />
          </div>
          <p v-else>
            Commercial Strain Only
          </p>
        </div>
        <div v-if="styles.length">
          <h3>Recommended Beer Styles</h3>
          <ul>
            <li v-for="style of styles" :key="style.id">
              <nuxt-link
                :to="'/organic-yeast-strains/beer-styles/' + style.slug"
                >{{ style.name }}</nuxt-link
              >
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
                    strain.strain_type.slug +
                    '/' +
                    strain.slug
                "
              >
                {{ strain.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Ordering</h3>
          <ul>
            <li>
              <nuxt-link to="/where-to-buy/purchase-yeast-online"
                >Order Online</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/where-to-buy">Find a Retailer</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/contact">Commercial Accounts</nuxt-link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    celsius: f => Math.round(((f - 32) * 5) / 9),
    flocculation(val) {
      return [
        'Very Low',
        'Low',
        'Med-Low',
        'Medium',
        'Med-High',
        'High',
        'Very High'
      ][val]
    }
  },
  computed: {
    styles() {
      return this.strain.beer_styles
        ? this.strain.beer_styles.map(s => s.beer_styles_id)
        : []
    },
    similar() {
      return this.strain.similar_strains
        ? this.strain.similar_strains.map(s => s.similar_strains_id)
        : []
    }
  },
  async asyncData({ params, $axios }) {
    const { slug } = params
    const fields = [
      '*.*',
      'strain_type.*',
      'beer_styles.beer_styles_id.*',
      'similar_strains.similar_strains_id.*',
      'similar_strains.similar_strains_id.strain_type.slug',
      'strain_type.home_packaging_image.*'
    ]
    const strain = await $axios
      .$get(
        `items/strains?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)
    return { strain }
  }
}
</script>

<style lang="scss">
.strain-detail-page {
  display: flex;
  padding-bottom: $size-1;
  aside {
    padding: $size-5;
    margin: 0 $size-5;
    background-color: $light;
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
        font-size: $size-4;
        text-transform: uppercase;
      }
      h1 {
        font-weight: $weight-black;
        font-size: $size-1;
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
      font-size: $size-2;
      line-height: 1;
      font-family: $family-heading;
      border: 5px solid $white;
    }

    .strain-description-short .strain-description-full {
      max-width: $readability-width;
      margin: 0 auto;
    }
    .strain-description-short {
      font-size: $size-5;
      text-align: center;
      margin: $size-1 0;
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
      margin-top: $size-3;
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

    .strain-detail {
      margin: $size-5 0;
      font-size: $size-6;
      text-transform: uppercase;
      color: $grey;
      font-family: $family-heading;
      .strain-detail-name,
      .strain-detail-info {
        display: inline;
      }

      .strain-detail-name:not(:first-child):before {
        content: '// ';
        margin: 0 8px;
      }
    }
  }
}
</style>
