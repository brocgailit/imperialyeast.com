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
            <div class="contact-information">
              <h4>{{ contact.name }}</h4>
              <address class="contact-address">
                {{ contact.street_address }} &bull;
                {{ contact.address_locality }},
                {{ contact.address_region }} &bull;
                {{ contact.address_country }}
              </address>

              <div>
                <h5>Hours</h5>
                <table
                  v-for="(hours, h) of contact.hours"
                  :key="h"
                  class="contact-hours"
                >
                  <tbody>
                    <tr v-for="(day, d) of hours.days_of_week" :key="d">
                      <th class="contact-hours-day">{{ daysOfWeek[d] }}</th>
                      <td v-if="day" class="contact-hours-times">
                        {{ hours.opens | timeTo12 }}—{{
                          hours.closes | timeTo12
                        }}
                      </td>
                      <td v-else>
                        Closed
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

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
            </div>
            <map-loader
              class="contact-locations-map"
              :markers="markers"
              :height="500"
              :zoom="9"
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
import format from 'date-fns/format'
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
    },
    timeTo12(time) {
      return format(`${format(new Date(), 'YYYY-MM-DD')} ${time}`, 'h:mm A')
    }
  },
  data() {
    return {
      DYNAMIC_COMPONENTS,
      daysOfWeek: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
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
  async asyncData({ params, $axios }) {
    const slug = 'contact'
    const fields = ['*.*', 'layouts.*.*']
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
  },
  jsonld() {
    return this.website.contacts.map(c => ({
      '@context': 'https://schema.org',
      '@type': c.type,
      name: `${this.website.name} - ${c.name}`,
      logo: this.website.logo_square.data.thumbnails.find(t => t.width > 500)
        .url,
      image: c.image
        ? c.image.data.thumbnails
            .filter(t =>
              [[500, 500], [1024, 768], [1280, 720]].some(
                ([w, h]) => t.width === w && t.height === h
              )
            )
            .map(t => t.url)
        : [],
      priceRange: Array(c.price_range)
        .fill('$')
        .join(''),
      contactPoint: c.contact_points.map(p => ({
        '@type': 'ContactPoint',
        telephone: p.telephone,
        email: p.email,
        contactType: p.contact_type,
        areaServed: p.areas_served,
        availableLanguage: p.available_languages,
        contactOption: [
          ...(p.toll_free ? ['TollFree'] : []),
          ...(p.hearing_impaired_supported ? ['HearingImpairedSupported'] : [])
        ]
      })),
      areaServed: c.areas_served,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: c.geo.lat,
        longitude: c.geo.lng
      },
      telephone: c.telephone,
      email: c.email, // TODO: add this!
      address: {
        '@type': 'PostalAddress',
        streetAddress: c.street_address,
        addressLocality: c.address_locality,
        addressRegion: c.address_region,
        postalCode: c.postal_code,
        addressCountry: c.address_country
      },
      url: this.website.canonical_url,
      sameAs: this.website.social_profiles.map(s => s.url),
      openingHoursSpecification: c.hours
        ? c.hours.map(h => {
            return {
              '@type': 'OpeningHoursSpecification',
              closes: h.closes,
              dayOfWeek: h.days_of_week.filter(d => d),
              opens: h.opens
            }
          })
        : []
    }))
  }
}
</script>

<style lang="scss">
.contact-page-contents {
  background-color: $light;
}
.contact-container {
  .contact-section {
    color: $dark;
    h4 {
      font-size: $size-5;
      font-weight: $weight-black;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    h5 {
      margin-top: $size-5;
      font-size: $size-7;
      text-transform: uppercase;
      font-weight: bold;
    }
    .contact {
      .contact-information {
        padding: 0 $size-7;
        .contact-address {
          font-size: $size-7;
          font-style: normal;
        }
        .contact-point {
          margin-top: $size-5;
          .contact-point-phone {
            white-space: nowrap;
          }
        }
        .contact-hours {
          width: 100%;
          font-size: $size-7;
          text-transform: uppercase;
          .contact-hours-day {
            font-weight: $weight-normal;
          }
          .contact-hours-times {
            white-space: nowrap;
          }
        }
      }
      .contact-locations-map {
        margin-top: $size-5;
      }
    }
  }
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
  @include touch {
    .contact-information {
      text-align: center;
      .contact-hours {
        width: auto !important;
        margin: 0 auto;
        font-size: $size-6 !important;
        .contact-hours-day {
          padding-right: $size-7;
        }
      }
    }
  }
}
</style>
