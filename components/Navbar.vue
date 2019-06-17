<template>
  <header class="header-nav">
    <div class="nav-logo">
      <nuxt-link to="/">
        <logo />
      </nuxt-link>
    </div>
    <nav class="global-nav">
      <ul>
        <li v-for="link of primaryLinks" :key="link.slug">
          <nuxt-link :to="'/' + (link.slug !== 'home' ? link.slug : '')">{{
            link.name
          }}</nuxt-link>
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
$logo-size: 160px;
.header-nav {
  background-color: $white;
  position: sticky;
  top: calc(-#{$logo-size} - #{$size-5});
  z-index: 1080;
  border-bottom: 1px solid rgba($grey, 0.25);
}
.nav-logo {
  width: $logo-size;
  height: $logo-size;
  margin: $size-5 auto;
}
.global-nav {
  text-align: center;
  ul {
    display: flex;
    justify-content: center;
    li {
      padding: $size-7 0;
      a {
        text-transform: uppercase;
        color: $black;
        font-weight: $weight-bold;
        font-size: $size-6;
        padding: $size-7;
        transition: 150ms ease-in-out;
        &:hover {
          opacity: 0.75;
        }
        &.nuxt-link-active {
          color: $primary;
        }
      }
    }
  }
}
</style>
