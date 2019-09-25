<template>
  <div class="container organization-contact">
    <div class="contact-details">
      <address v-if="org.address" class="contact-address">
        <h3 class="title">{{ org.name }}</h3>
        {{ org.address.streetAddress }}<br />
        {{ org.address.addressLocality }},
        {{ org.address.addressRegion }}
        {{ org.address.postalCode }}
        <!-- <br />{{ org.address.addressCountry }} -->
        <br /><a :href="'mailto:' + org.email">{{ org.email }}</a>
      </address>
      <ul class="contact-profiles">
        <li
          v-for="profile of org.profiles"
          :key="profile.value.platform"
          class="contact-profile"
        >
          <a
            :href="profile.value.url"
            target="_blank"
            rel="noopener"
            :aria-label="profile.value.platform"
          >
            <fa-icon :icon="['fab', profile.value.platform]" size="2x" />
          </a>
        </li>
      </ul>
      <table v-for="(hours, h) of org.hours" :key="h" class="contact-hours">
        <thead>
          <tr>
            <th colspan="2" class="title">Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, d) of hours.value.days" :key="d">
            <th class="contact-hours-day">{{ daysOfWeek[d] }}</th>
            <td v-if="day" class="contact-hours-times">
              {{ hours.value.opens }}—{{ hours.value.closes }}
            </td>
            <td v-else>
              Closed
            </td>
          </tr>
        </tbody>
      </table>
      <div class="contact-points">
        <div
          v-for="point of org.contactPoints"
          :key="point.value.contactType"
          class="contact-point"
        >
          <h3 class="title">{{ point.value.contactType }}</h3>
          <div class="contact-phone">
            <a
              class="contact-phone-link"
              :href="mobile ? 'tel:' + point.value.telephone : '#'"
              >{{ point.value.telephone | formatPhone }}</a
            >

            <span v-if="point.value.tollFree" class="contact-phone-tollfree">
              — Toll Free
            </span>
          </div>

          <a class="contact-email" :href="'mailto:' + point.value.email">{{
            point.value.email
          }}</a>

          <!-- <dl class="contact-features">
            <dt class="contact-feature-title">Languages:</dt>
            <dd class="contact-feature">
              {{ point.value.availableLanguage.join(', ') }}
            </dd>
          </dl>

          <dl class="contact-features">
            <dt class="contact-feature-title">Hearing Impaired Supported:</dt>
            <dd class="contact-feature">
              {{ point.value.hearingImpairedSupported ? 'YES' : 'NO' }}
            </dd>
          </dl> -->
        </div>
      </div>
    </div>
    <map-loader
      class="contact-map column"
      :markers="markers"
      :height="500"
      :zoom="9"
    />
  </div>
</template>

<script>
import MapLoader from '~/components/MapLoader.vue'
import { component } from '~/assets/script/mixins'
export default {
  name: 'ContactOrganizationLayout',
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
  mixins: [component],
  data() {
    return {
      mobile: false,
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
    org() {
      return this.layout.settings.organization
    },
    markers() {
      if (!this.org.address || !this.org.geo) return []
      const { streetAddress, addressLocality } = this.org.address
      const { lat, lng } = this.org.geo
      return [
        {
          id: this.org._id,
          coords: [lat, lng],
          popup: {
            title: this.org.name,
            content: `
              <address>
                ${streetAddress} &bull; ${addressLocality}
              </address>
              <a rel="noopener" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" class="button is-primary is-small">Directions</a>
            `
          }
        }
      ]
    }
  },
  mounted() {
    this.mobile = window.matchMedia('(max-width: 768px)').matches
  },
  jsonld() {
    return {
      '@context': 'https://schema.org',
      '@type': this.org.type || 'ProfessionalService',
      name: `${this.org.name}`,
      logo: this.$options.filters.asset(this.org.logo.path),
      image: [
        this.$options.filters.asset(this.org.image.path, {
          w: 500,
          h: 500,
          fit: 'min'
        }),
        this.$options.filters.asset(this.org.image.path, {
          w: 1024,
          h: 768,
          fit: 'min'
        }),
        this.$options.filters.asset(this.org.image.path, {
          w: 1280,
          h: 720,
          fit: 'min'
        })
      ],
      priceRange: Array(this.org.priceRange)
        .fill('$')
        .join(''),
      contactPoint: this.org.contactPoints.map(p => ({
        '@type': 'ContactPoint',
        telephone: p.value.telephone,
        email: p.value.email,
        contactType: p.value.contactType,
        areaServed: p.value.areaServed,
        availableLanguage: p.value.availableLanguages,
        contactOption: [
          ...(p.value.tollFee ? ['TollFree'] : []),
          ...(p.value.hearingImpairedSupported
            ? ['HearingImpairedSupported']
            : [])
        ]
      })),
      areaServed: this.org.areas_served,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: this.org.geo.lat,
        longitude: this.org.geo.lng
      },
      telephone: this.org.telephone,
      email: this.org.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.org.address.streetAddress,
        addressLocality: this.org.address.addressLocality,
        addressRegion: this.org.address.addressRegion,
        postalCode: this.org.address.postalCode,
        addressCountry: this.org.address.addressCountry
      },
      url: this.org.url,
      sameAs: this.org.profiles.map(s => s.value.url),
      openingHoursSpecification: this.org.hours
        ? this.org.hours.map(h => {
            return {
              '@type': 'OpeningHoursSpecification',
              closes: h.value.closes,
              dayOfWeek: h.value.days.filter(d => d),
              opens: h.value.opens
            }
          })
        : []
    }
  }
}
</script>

<style lang="scss">
.organization-contact {
  .contact-address {
    text-align: center;
    font-style: normal;
    font-size: $size-6;
    .title {
      font-size: $size-4;
    }
  }
  .contact-hours {
    margin: $size-5 auto;
    .title {
      text-align: center;
      font-size: $size-5 * 1.2;
      padding-bottom: $size-7;
    }
    .contact-hours-day {
      text-transform: uppercase;
      padding-right: $size-7;
    }
  }

  .contact-point {
    margin-top: $size-5;
    text-align: center;
    .title {
      font-size: $size-5 * 1.2;
      text-transform: capitalize;
      margin-bottom: $size-7;
    }
  }

  .contact-profiles {
    margin: $size-5 auto;
    display: table;
    .contact-profile {
      display: inline;
      margin: $size-7;
      &:first-child {
        margin-left: 0;
      }
    }
  }

  .contact-phone {
    font-size: $size-5;
    @include tablet {
      .contact-phone-link {
        color: $dark;
        cursor: default;
      }
    }
    .contact-phone-tollfree {
      font-size: 75%;
    }
  }

  .contact-email {
    display: inline-block;
    margin-bottom: $size-5;
  }

  .contact-features {
    * {
      display: inline;
    }
    .contact-feature-title {
      font-weight: $weight-bold;
      text-transform: uppercase;
    }
  }
}
</style>
