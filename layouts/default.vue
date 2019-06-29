<template>
  <div>
    <transition name="slide-down">
      <div v-if="notification" class="notification">
        <div v-html="notification.message" />
        <nuxt-link
          v-for="action of notification.actions"
          :key="action.id"
          class="button is-danger is-small"
          :to="action.path"
          @click="clearNotification(notification)"
        >
          {{ action.label }}
        </nuxt-link>
        <button
          class="delete has-background-grey"
          type="button"
          @click="clearNotification(notification)"
        >
          Close
        </button>
      </div>
    </transition>
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
  jsonld() {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Website',
        url: this.website.canonical_url
      }
    ]
  },
  data() {
    return {
      keybuffer: [],
      notification: null
    }
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      website: state => state.website,
      isShaded: state => state.showNavigation
    })
  },
  mounted() {
    const { dom } = require('@fortawesome/fontawesome-svg-core')
    dom.watch()
    window.addEventListener('keyup', this.handleKeys)
    const dismissed = (this.$cookies.get('dismissedNotifications') || '').split(
      ','
    )
    this.notification = this.notifications.find(
      n => !dismissed.some(d => +d === n.id)
    )
  },
  methods: {
    clearNotification(notification) {
      if (this.$cookies) {
        this.$cookies.set('dismissedNotifications', [notification.id])
      }
      this.$store.dispatch('clearNotification', notification)
      this.notification = null
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
        window.location = 'https://www.youtube.com/watch?v=-bzWSJG93P8'
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
  position: fixed;
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

.slide-down-enter-active,
.slide-down-leave-active {
  transition: 750ms ease-out;
}
.slide-down-enter,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
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
