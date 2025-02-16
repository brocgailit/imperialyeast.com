<template>
  <header class="header-nav">
    <div class="nav-logo">
      <nuxt-link to="/" @click="isOpen = false">
        <logo color="crown" />
      </nuxt-link>
    </div>
    <nav
      role="navigation"
      aria-label="Main"
      class="global-nav container"
      :class="{ 'is-open': isOpen, 'search-active': showSearch }"
      @click="isOpen = false"
    >
      <ul v-if="menu" id="mainMenu" class="menu">
        <li v-for="(item, i) of menu.items" :key="item.value.page._id + i">
          <navbar-item :item="item" />
        </li>
        <li>
          <button
            class="search-toggle is-hidden-touch"
            type="button"
            @click.stop="toggleSearch(true)"
          >
            <fa-icon :icon="['fal', 'search']" size="lg" />
          </button>
        </li>
      </ul>
      <ul v-if="secondaryMenu" id="secondaryMenu" class="menu">
        <li
          v-for="(item, i) of secondaryMenu.items"
          :key="item.value.page._id + i"
        >
          <navbar-item :item="item" secondary />
        </li>
      </ul>
      <site-search
        :active.sync="showSearch"
        class="site-search"
        @change="toggleSearch"
      />
    </nav>
    <button
      aria-haspopup="true"
      :aria-expanded="isOpen"
      aria-controls="menu"
      aria-label="Navigation"
      class="menu-button"
      :class="{ 'is-open': isOpen }"
      type="button"
      @click="isOpen = !isOpen"
    >
      <div class="menu-button-stroke" />
      <span class="menu-button-title">Main Menu</span>
    </button>
    <button
      class="search-toggle mobile-search-toggle is-hidden-desktop"
      type="button"
      @click.stop="toggleSearch(true)"
    >
      <fa-icon :icon="['fal', 'search']" size="2x" title="Toggle Search" />
    </button>
  </header>
</template>

<script>
import Logo from '~/components/Logo.vue'
import SiteSearch from '~/components/SiteSearch.vue'
import NavbarItem from '~/components/NavbarItem.vue'
export default {
  name: 'Navbar',
  components: {
    Logo,
    SiteSearch,
    NavbarItem
  },
  props: {
    menu: {
      type: Object,
      default: () => null
    },
    secondaryMenu: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      showSearch: false
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.showNavigation
      },
      set(visible) {
        if (visible) {
          this.$store.dispatch('openNavigation')
          this.toggleSearch(false)
        } else {
          this.$store.dispatch('closeNavigation')
        }
      }
    },
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
  },
  methods: {
    toggleSearch(show) {
      if (typeof show === 'undefined') {
        this.showSearch = !this.showSearch
        return
      }
      this.showSearch = show
      if (this.showSearch) {
        this.isOpen = false
      }
    }
  }
}
</script>

<style lang="scss">
$logo-size: 160px;

.header-nav {
  background-color: $white;
  position: sticky;
  top: calc(-#{$logo-size} - #{$size-5 * 2});
  z-index: $navbar-fixed-z;
  border-bottom: 1px solid rgba($grey, 0.25);
  padding-top: $size-5;
  .nav-logo {
    width: $logo-size;
    height: $logo-size;
    margin: 0 auto $size-5;
  }
  .global-nav {
    position: relative;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    margin: 0 auto;
    max-width: 1200px;
    .menu {
      a {
        text-transform: uppercase;
        font-weight: $weight-bold;
        font-size: $size-6 * 1.1;
        transition: 150ms ease-in-out;
      }
      transition: opacity 250ms ease-in-out;
      width: 100%;
      flex: 1 0 100%;
      display: flex;
      justify-content: center;
    }

    @include desktop {
      #secondaryMenu {
        a {
          font-size: $size-7;
          text-transform: uppercase;
        }
        .navbar-item {
          padding-top: 0;
        }
      }
    }

    &.search-active {
      .menu {
        opacity: 0;
        pointer-events: none;
      }
    }
  }

  .search-toggle {
    background-color: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  @include desktop {
    .menu-button {
      display: none;
    }
    .global-nav {
      padding: 0 $size-7;
    }
  }

  @include touch {
    height: $navbar-height-touch;
    background-color: rgba($white, 0.95);
    backdrop-filter: blur(15px);
    padding-top: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .nav-logo {
      width: $logo-size * 0.5;
      height: $logo-size * 0.5;
      margin: 0;
      &,
      a {
        display: block;
        display: flex;
        align-items: center;
        justify-content: center;
      }
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
      .menu-button-title {
        position: absolute;
        display: inline-block;
        overflow: hidden;
        text-indent: -8675309px;
        width: 1px;
        height: 0;
      }
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
    .mobile-search-toggle {
      color: $grey;
      position: absolute;
      right: $size-2;
      top: 50%;
      padding: 0;
    }
    .global-nav {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      // height: 0;
      pointer-events: none;
      overflow: visible;
      .menu {
        width: 100%;
        background-color: $white;
        opacity: 0;
        transform: translateX(-100%);
        transition: 250ms ease-in-out;
        display: flex;
        flex-direction: column;
        text-align: left;
        li {
          padding: 0;
          border-bottom: 1px solid $light;
          a {
            pointer-events: all;
            display: inline-block;
            width: 100%;
            font-size: $size-7;
          }
        }
      }

      &.is-open {
        .menu {
          opacity: 1;
          display: block;
          transform: translateX(0);
        }
      }

      .site-search {
        position: absolute;
        pointer-events: all;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        .site-search-results {
          max-height: calc(100vh - 50px - #{$navbar-height-touch} - 50px);
          overflow-y: scroll;
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 250ms ease-in-out;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
