<template>
  <footer class="page-footer">
    <nav>
      <ul>
        <li v-for="link of footerLinks" :key="link.slug">
          <nuxt-link :to="'/' + (link.slug !== 'home' ? link.slug : '')">{{
            link.name
          }}</nuxt-link>
        </li>
      </ul>
    </nav>
    <ul class="footer-social-media">
      <li v-for="profile of website.social_profiles" :key="profile.name">
        <a
          :href="profile.url"
          rel="noopener"
          target="_blank"
          :aria-label="profile.name"
        >
          <fa-icon :icon="['fab', profile.platform]" size="lg" />
        </a>
      </li>
    </ul>
    <p class="copyright-notice">
      &copy; {{ year }} {{ website.name }}. All rights reserved.
    </p>
    <p class="attribution">
      {{ website.name }} is certified organic by the
      <a
        href="http://www.usda.gov/wps/portal/usda/usdahome?contentidonly=true&contentid=organic-agriculture.html"
        >USDA</a
      >
      and
      <a href="http://tilth.org/">Oregon Tilth.</a><br />
      Photos by PDX Foto | Site by
      <a href="https://www.heavycraft.io">Heavy Craft</a>
    </p>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      year: new Date().getFullYear()
    }
  },
  computed: {
    ...mapState({
      website: state => state.website,
      footerLinks: state =>
        state.pages.filter(
          page => page.status === 'published' && page.footer_navigation
        )
    })
  }
}
</script>

<style lang="scss">
.page-footer {
  width: 100%;
  background-color: $black;
  color: $light;
  padding: $size-3;
  a {
    color: $white;
    font-weight: $weight-bold;
    transition: 150ms ease-in-out;
    &:hover {
      opacity: 0.85;
    }
  }
  nav {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      li {
        a {
          display: inline-block;
          text-transform: uppercase;
          font-size: $size-6;
          padding: 0 $size-7;
          margin: 4px;
          white-space: nowrap;
        }
      }
    }
  }
  .footer-social-media {
    display: flex;
    justify-content: center;
    margin: $size-5 0;
    li {
      margin: $size-7;
      a {
        display: inline-block;
        line-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: $size-2;
        height: $size-2;
        background-color: $light;
        border-radius: 100%;
        color: $grey;
        &:hover {
          background-color: $primary;
          color: $white;
        }
      }
    }
  }

  .copyright-notice,
  .attribution {
    text-align: center;
    font-size: $size-7;
  }
  .attribution {
    margin-top: $size-7;
  }
}
</style>
