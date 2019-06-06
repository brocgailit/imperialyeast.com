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
    <a class="scroll-to-top">
      <fa :icon="['fal', 'arrow-up']" size="2x" />
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '~/components/Navbar.vue'
import PageFooter from '~/components/PageFooter.vue'
export default {
  components: {
    Navbar,
    PageFooter
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

.scroll-to-top {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: $size-1;
  right: $size-5;
  border: 3px solid $light;
  border-radius: 100%;
  width: 65px;
  height: 65px;
  color: $light;
  transition: 150ms;
  &:hover {
    color: $grey;
    background-color: $light;
  }
}
</style>
