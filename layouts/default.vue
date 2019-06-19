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
      <button
        class="delete"
        type="button"
        @click="clearNotification(notification)"
      >
        Close
      </button>
    </div>
    <Navbar />
    <main>
      <nuxt />
    </main>
    <PageFooter />
    <div class="scroll-top-container">
      <scroll-top-button />
    </div>
    <transition name="shade">
      <div v-if="isShaded" class="shade" @click="closeNavigation" />
    </transition>
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
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: this.website.canonical_url + this.$route.path
        }
      ]
    }
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
            ...(p.hearing_impaired_supported
              ? ['HearingImpairedSupported']
              : [])
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
    ]
  },
  data() {
    return {
      keybuffer: []
    }
  },
  computed: {
    ...mapState({
      notification: state => state.notifications[0],
      website: state => state.website,
      isShaded: state => state.showNavigation
    })
  },
  mounted() {
    window.addEventListener('keyup', this.handleKeys)
  },
  methods: {
    clearNotification(notification) {
      if (this.$cookies) {
        this.$cookies.set('dismissedNotifications', [notification.id], {
          maxAge: 60 * 60 * 24 * 7
        })
      }
      this.$store.dispatch('clearNotification', notification)
    },
    closeNavigation() {
      this.$store.dispatch('closeNavigation')
    },
    handleKeys(event) {
      if (!event.key) return
      const secret = [
        'arrowup',
        'arrowup',
        'arrowdown',
        'arrowdown',
        'arrowleft',
        'arrowright',
        'arrowleft',
        'arrowright',
        'b',
        'a',
        'enter'
      ]
      const keybuffer = [...this.keybuffer, event.key.toLowerCase()].slice(
        -secret.length
      )
      if (keybuffer.join('-').indexOf(secret.join('-')) > -1) {
        const { Clip } = require('phonograph')
        const clip = new Clip({ url: '/audio/Imperial_March.mp3' })
        clip.buffer().then(() => {
          clip.play()
        })
      }
      this.keybuffer = keybuffer
    }
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
  margin: 0 !important;
  // padding: $size-7;
  position: sticky;
  top: 0;
  .button {
    margin: 4px $size-7;
  }
}

.scroll-top-container {
  position: fixed;
  z-index: 8675309;
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

.shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100vh;
  background-color: $dark;
  opacity: 0.5;
  z-index: 1075;
}

.shade-enter-active,
.shade-leave-active {
  transition: opacity 250ms linear;
}
.shade-enter,
.shade-leave-to {
  opacity: 0;
}
</style>
