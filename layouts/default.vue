<template>
  <div>
    <div v-if="notification" class="notification">
      <div v-html="notification.message" />
      <nuxt-link
        v-for="action of notification.actions"
        :key="action.id"
        class="button is-danger is-small"
        :to="action.path"
      >
        {{ action.label }}
      </nuxt-link>
    </div>
    <Navbar />
    <main>
      <nuxt />
    </main>
    <PageFooter />
    <div class="scroll-top-container">
      <scroll-top-button />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '~/components/Navbar.vue'
import PageFooter from '~/components/PageFooter.vue'
import ScrollTopButton from '~/components/ScrollTopButton.vue'

/* const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
 */
export default {
  components: {
    Navbar,
    PageFooter,
    ScrollTopButton
  },
  jsonld() {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Website',
        url: this.website.canonical_url
      },
      ...this.website.contacts.map(c => ({
        '@context': 'https://schema.org',
        '@type': c.type,
        name: `${this.website.name} - ${c.name}`,
        // logo: this.website.logo.data.url,
        /* TODO:
        image: c.image
          ? [
              `https:${this.website.contact.image.file.url}w=1200&h=1200`,
              `https:${this.website.contact.image.file.url}w=1200&h=800`,
              `https:${this.website.contact.image.file.url}w=1200&h=675`
            ]
          : [], */
        /* contactPoint: c.contact_points.map(p => ({
          '@type': 'ContactPoint',
          telephone: p.telephone,
          email: p.email,
          contactType: p.contact_type,
          areaServed: p.areas_served,
          availableLanguage: p.available_languages,
          contactOption: [
            ...(p.toll_free ? ['TollFree'] : []),
            ...(p.hearing_impaired_supported
              ? ['HearingImpairedSupported']
              : [])
          ]
        })), */
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
        }
        // sameAs: this.website.social_profiles.map(s => s.url)
        /* openingHoursSpecification: c.hours
          ? Object.entries(
              this.website.contact.hours.reduce((acc, hours) => {
                DAYS_OF_WEEK.forEach(day => {
                  const h = hours[day.toLowerCase()]
                  Object.assign(
                    acc,
                    h
                      ? {
                          [day]: {
                            opens: hours.from,
                            closes: hours.to
                          }
                        }
                      : {}
                  )
                })
                return acc
              }, {})
            ).map(entry => {
              const [d, h] = entry
              return {
                '@type': 'OpeningHoursSpecification',
                closes: h.closes,
                dayOfWeek: `http://schema.org/${d}`,
                opens: h.opens
              }
            })
          : [] */
      }))
    ]
  },
  computed: {
    ...mapState({
      notification: state => state.notifications[0],
      website: state => state.website
    })
  }
}
</script>

<style lang="scss">
.notification {
  z-index: 8675309;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: $black;
  width: 100%;
  text-align: center;
  color: $white;
  font-weight: bold;
  padding: $size-7;
  position: sticky;
  top: 0;
  .button {
    margin: 0 $size-7;
  }
}

.scroll-top-container {
  position: fixed;
  bottom: $size-1;
  right: $size-5;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: 750ms ease-out;
}
.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
