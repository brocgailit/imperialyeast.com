<template>
  <div>
    <div v-if="notification" class="notification">
      {{ notification.text }}
      <b-button v-if="notification.action" type="is-danger" size="is-small">{{
        notification.action.label
      }}</b-button>
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
import Navbar from '~/components/Navbar.vue'
import PageFooter from '~/components/PageFooter.vue'
export default {
  components: {
    Navbar,
    PageFooter
  },
  data() {
    return {
      notification: {
        text:
          'COMMERCIAL PITCHES: A38, A07, G03 and L13 IN-STOCK OR YOUR ORDER SHIPS FREE!',
        action: {
          label: 'Learn More'
        }
      }
    }
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
  button {
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
