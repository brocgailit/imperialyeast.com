<template>
  <header class="header-nav">
    <div class="nav-logo">
      <nuxt-link to="/">
        <logo />
      </nuxt-link>
    </div>
    <nav
      class="global-nav"
      :class="{ 'is-open': isOpen }"
      @click="isOpen = false"
    >
      <ul>
        <li v-for="link of primaryLinks" :key="link.slug">
          <nuxt-link :to="'/' + (link.slug !== 'home' ? link.slug : '')">{{
            link.name
          }}</nuxt-link>
        </li>
      </ul>
    </nav>
    <button
      class="menu-button"
      :class="{ 'is-open': isOpen }"
      type="button"
      @click="isOpen = !isOpen"
    >
      <div class="menu-button-stroke" />
    </button>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo
  },
  data() {
    return {
      isOpen: false
    }
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

  @include desktop {
    .menu-button {
      display: none;
    }
  }

  @include touch {
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .nav-logo {
      width: $logo-size * 0.5;
      height: $logo-size * 0.5;
      margin: $size-7 auto;
    }
    .menu-button {
      padding: 0;
      outline: none;
      border: none;
      $height: 24px;
      $thickness: 4px;
      position: absolute;
      height: $height;
      width: $height;
      left: $size-2;
      top: calc(50% - #{$height / 2});
      background-color: transparent;
      .menu-button-stroke {
        position: relative;
        width: 100%;
        height: $thickness;
        &,
        &:before,
        &:after {
          background-color: $grey;
          transition: 250ms ease-in-out;
        }
        &:before,
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        &:before {
          transform: translateY(-$height/2 + $thickness);
        }
        &:after {
          transform: translateY($height/2 - $thickness);
        }
      }
      &.is-open {
        .menu-button-stroke {
          background-color: transparent;
          &:before {
            transform: translateY(0) rotate(135deg);
          }
          &:after {
            transform: translateY(0) rotate(-135deg);
          }
        }
      }
    }
    .global-nav {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      ul {
        background-color: $white;
        opacity: 0;
        transform: translateX(-100%);
        transition: 450ms ease-in-out;
        display: flex;
        flex-direction: column;
        text-align: left;
        li {
          padding: 0;
          border-bottom: 1px solid $light;
          a {
            display: inline-block;
            width: 100%;
          }
        }
      }

      &.is-open ul {
        opacity: 1;
        display: block;
        transform: translateX(0);
      }
    }
  }
}
</style>
