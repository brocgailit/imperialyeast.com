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
export default {
  components: {
    Navbar,
    PageFooter,
    ScrollTopButton
  },
  computed: {
    ...mapState({
      notification: state => state.notifications[0]
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
