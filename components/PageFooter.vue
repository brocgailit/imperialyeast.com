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
    <div class="contact-details">
      <div
        v-for="contact of website.contacts"
        :key="contact.id"
        class="contact"
      >
        <div class="contact-information">
          <div
            v-for="(point, p) of contact.contact_points"
            :key="p"
            class="contact-point"
          >
            <h5>{{ point.contact_type }}</h5>
            <span v-if="!shouldLinkPhone" class="contact-point-phone">{{
              point.telephone | formatPhone
            }}</span>
            <a
              v-else
              class="contact-point-phone"
              :href="'tel:' + point.telephone"
              >{{ point.telephone | formatPhone }}</a
            >
            <a :href="'mailto:' + point.email">
              {{ point.email }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <ul class="footer-social-media">
      <li v-for="profile of website.social_profiles" :key="profile.platform">
        <a
          :href="profile.url"
          rel="noopener"
          target="_blank"
          :aria-label="profile.platform"
        >
          <fa-icon
            :icon="['fab', profile.platform]"
            size="lg"
            :title="profile.platform"
          />
        </a>
      </li>
    </ul>
    <p class="copyright-notice">
      &copy; {{ year }} {{ website.name }}. All rights reserved.
    </p>
    <div class="attribution" v-html="website.footer_attribution" />
  </footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  filters: {
    formatPhone(number) {
      const cleaned = ('' + number).replace(/\D/g, '')
      const parts = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
      if (!parts) return null
      return ['(', parts[2], ') ', parts[3], '-', parts[4]].join('')
    }
  },
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
    }),
    shouldLinkPhone() {
      return typeof window !== 'undefined'
        ? window.matchMedia('(max-width: 768px)').matches
        : false
    }
  }
}
</script>

<style lang="scss">
.page-footer {
  width: 100%;
  background-color: $black;
  color: $light;
  padding: $size-3 $size-7;
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
          font-size: $size-7;
          padding: 4px $size-7;
          margin: 8px;
          white-space: nowrap;
        }
      }
    }
  }

  .contact-details {
    margin: $size-5 auto;
    text-align: center;
    .contact-point {
      & > * {
        display: block;
      }
      h5 {
        font-weight: $weight-bold;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .contact-point-phone {
        font-size: $size-4;
        font-weight: $weight-black;
        letter-spacing: 0.05em;
      }
      a {
        font-size: $size-7;
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
        color: $dark;
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
