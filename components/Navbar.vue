<template>
  <header>
    <div class="nav-logo">
      <logo />
    </div>
    <nav class="global-nav">
      <ul>
        <li v-for="link of primaryLinks" :key="link.slug">
          <nuxt-link :to="link.slug">{{ link.name }}</nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo
  },
  computed: {
    ...mapState({
      pages: state => state.pages
    }),
    primaryLinks() {
      return this.pages
        ? this.pages.filter(
            page =>
              page.status === 'published' &&
              page.global_navigation &&
              page.primary
          )
        : []
    }
  }
}
</script>

<style lang="scss">
.nav-logo {
  width: 160px;
  margin: $size-5 auto;
}
.global-nav {
  text-align: center;
  margin-bottom: $size-5;
  ul {
    display: flex;
    justify-content: center;
    li {
      a {
        text-transform: uppercase;
        color: $black;
        font-weight: $weight-bold;
        font-size: $size-6;
        padding: $size-7;
        transition: 150ms ease-in-out;
        &:hover {
          opacity: 0.85;
        }
      }
    }
  }
}
</style>
