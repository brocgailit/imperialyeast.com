<template>
  <footer class="page-footer">
    <nav>
      <ul>
        <li v-for="link of menu.items" :key="link.value.page._id">
          <nuxt-link
            :to="
              '/' +
                (link.value.page._id !== website.homepage._id
                  ? link.value.page.name_slug + '/'
                  : '')
            "
            >{{ link.value.title }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <div v-if="website.organization" class="contact-details">
      <div class="contact">
        <div class="contact-information">
          <div
            v-for="(point, p) of website.organization.contactPoints"
            :key="p"
            class="contact-point"
          >
            <h5>{{ point.value.contactType }}</h5>
            <span v-if="!shouldLinkPhone" class="contact-point-phone">{{
              point.value.telephone | formatPhone
            }}</span>
            <a
              v-else
              class="contact-point-phone"
              :href="'tel:' + point.value.telephone"
              >{{ point.value.telephone | formatPhone }}</a
            >
            <a v-if="point.value.email" :href="'mailto:' + point.value.email">
              {{ point.value.email }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <ul class="footer-social-media">
      <li
        v-for="profile of (website.organization || website.author).profiles"
        :key="profile.value.platform"
      >
        <a
          :href="profile.value.url"
          rel="noopener"
          target="_blank"
          :aria-label="profile.value.platform"
        >
          <fa-icon
            :icon="['fab', profile.value.platform]"
            size="lg"
            :title="profile.value.platform"
          />
        </a>
      </li>
    </ul>
    <p class="copyright-notice">
      &copy; {{ year }} {{ (website.organization || website.author).name }}. All
      rights reserved.
    </p>
    <div class="attribution" v-html="website.footer" />
  </footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PageFooter',
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
      menu: state => state.menu.footer
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
