<template>
  <footer class="page-footer">
    <nav>
      <ul>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
      </ul>
    </nav>
    <ul class="footer-social-media">
      <li>
        <a href="https://www.instagram.com" aria-label="instagram">
          <fa :icon="['fab', 'instagram']" size="lg" />
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com" aria-label="facebook">
          <fa :icon="['fab', 'facebook']" size="lg" />
        </a>
      </li>
      <li>
        <a href="https://www.youtube.com" aria-label="youtube">
          <fa :icon="['fab', 'youtube']" size="lg" />
        </a>
      </li>
    </ul>
    <p class="copyright-notice">
      &copy; 2019 Imperial Yeast. All rights reserved.
    </p>
    <p class="attribution">
      Imperial Yeast is certified organic by the
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
      justify-content: center;
      li {
        a {
          text-transform: uppercase;
          font-size: $size-6;
          padding: $size-7;
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
