<template>
  <div>
    <transition name="slide-down">
      <div v-if="notification" class="notification">
        <div v-html="notification.message" />
        <nuxt-link
          v-if="notification.action"
          class="button is-danger is-small"
          :to="notification.action.path + '/'"
          :title="notification.action.title"
          @click="clearNotification(notification)"
        >
          {{ notification.action.label }}
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
    <navbar :menu="mainMenu" />
    <main>
      <nuxt />
    </main>
    <page-footer
      :homepage="website.homepage"
      :owner="website.organization || website.author"
      :menu="footerMenu"
    >
      <div v-html="website.footer" />
    </page-footer>
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
const phonograph = () => import('phonograph')

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
        url: this.website.canonicalURL
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
      isShaded: state => state.showNavigation,
      mainMenu: state => state.menu.main,
      footerMenu: state => state.menu.footer
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
      n => !dismissed.some(d => +d === n._id)
    )
  },
  methods: {
    clearNotification(notification) {
      if (this.$cookies) {
        this.$cookies.set(
          'dismissedNotifications',
          [notification._id],
          60 * 60 * 24 * 30
        )
      }
      this.$store.dispatch('clearNotification', notification)
      this.notification = null
    },
    closeNavigation() {
      this.$store.dispatch('closeNavigation')
    },
    handleKeys(event) {
      // EASTER EGGS!
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
        // window.location = 'https://www.youtube.com/watch?v=-bzWSJG93P8'
        ;(async function() {
          const { Clip } = await phonograph()
          const clip = new Clip({ url: '/audio/Imperial_March.mp3' })
          clip.buffer().then(() => {
            clip.play()
          })
        })()
      }
      this.keybuffer = keybuffer
    }
  }
}
</script>

<style lang="scss">
.notification {
  z-index: $navbar-z + 10;
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
  z-index: $navbar-z - 10;
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
  z-index: $navbar-z - 10;
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
