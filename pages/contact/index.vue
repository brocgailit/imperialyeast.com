<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === header.type).ref"
      :layout="header"
    />
    <div class="contact-page-contents">
      <div class="contact-container container">
        <div class="contact-sections">
          <component
            :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
            v-for="layout of layouts"
            :key="layout.id"
            :layout="layout"
          />
        </div>
        <aside class="contact-section">
          <div
            v-for="contact of website.contacts"
            :key="contact.id"
            class="contact"
          >
            <h4>{{ contact.name }}</h4>
            <address class="contact-address">
              {{ contact.street_address }}
              {{ contact.address_locality }}, {{ contact.address_region }}
              {{ contact.address_country }}
            </address>
            <div
              v-for="(point, p) of contact.contact_points"
              :key="p"
              class="contact-point"
            >
              <h5>{{ point.contact_type }}</h5>
              <a :href="'mailto:' + point.email">
                {{ point.email }}
              </a>
              <span class="contact-point-phone">{{
                point.telephone | formatPhone
              }}</span>
            </div>
            <map-loader
              class="contact-locations-map"
              :markers="markers"
              :height="500"
              :zoom="zoom"
              :center="center"
            />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'
import MapLoader from '~/components/MapLoader.vue'
export default {
  components: {
    MapLoader
  },
  filters: {
    formatPhone(number) {
      const cleaned = ('' + number).replace(/\D/g, '')
      const parts = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
      if (!parts) return null
      return ['(', parts[2], ') ', parts[3], '-', parts[4]].join('')
    }
  },
  data() {
    return {
      DYNAMIC_COMPONENTS
    }
  },
  computed: {
    ...mapState({
      website: state => state.website
    }),
    header() {
      return this.page.layouts.find(
        l => l.type === 'header' || l.type === 'hero'
      )
    },
    layouts() {
      return this.page.layouts.filter(l => l !== this.header)
    },
    markers() {
      return this.website.contacts.map(location => {
        const { name, street_address, address_locality, geo } = location
        const { lat, lng } = geo
        return {
          id: location.id,
          coords: [lat, lng],
          popup: {
            title: name,
            content: `
                <address>
                  ${street_address} &bull; ${address_locality}
                </address>
                <a rel="noopener" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" class="button is-primary is-small">Directions</a>
              `
          }
        }
      })
    }
  },
  jsonld() {
    const schema = []
    return schema
  },
  async asyncData({ params, $axios }) {
    const slug = 'contact'
    const fields = [
      '*.*',
      'layouts.*.*',
      'layouts.forms.fields.*',
      'layouts.forms.*'
    ]
    const page = await $axios
      .$get(
        `items/pages?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)
    return { page }
  },
  head() {
    return {
      title: `${this.page.title} | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description
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
          content: this.page.description
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: this.page.title
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.data.url
            : this.website.default_sharing_image.data.url
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.title
            : this.website.default_sharing_image.title
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
          content: this.page.description
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: this.page.title
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.data.url
            : this.website.default_sharing_image.data.url
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.contact-page-contents {
  background-color: $light;
}
.contact-container {
  @include desktop {
    display: flex;
    .contact-sections {
      flex-grow: 1;
    }
    .contact-section {
      max-width: 400px;
      flex: 0 0 400px;
      padding: $size-1 $size-7;
    }
  }
  .contact-section {
    color: $dark;
    h4 {
      font-size: $size-5;
      font-weight: $weight-black;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .contact-address {
      font-size: $size-7;
      font-style: normal;
    }
    .contact {
      .contact-point {
        margin-top: $size-5;
        h5 {
          font-weight: $weight-bold;
          text-transform: uppercase;
        }
        .contact-point-phone {
          white-space: nowrap;
        }
      }
    }
    .contact-locations-map {
      margin-top: $size-5;
    }
  }
}
</style>
