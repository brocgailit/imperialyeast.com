<template>
  <header>
    <div class="nav-logo">
      <logo />
    </div>
    <nav class="global-nav">
      <ul>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/">Yeast Strains</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/">FAQs</nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo
  }
}
</script>

<style lang="scss">
.nav-logo {
  width: 160px;
  margin: $size-6 auto;
}
.global-nav {
  text-align: center;
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
