<template>
  <div
    v-if="item.value.submenus"
    aria-role="menu"
    class="navbar-item has-dropdown is-hoverable"
  >
    <nuxt-link
      role="button"
      class="navbar-link"
      :to="isHomePage ? '/' : '/' + item.value.page.name_slug + '/'"
    >
      {{ item.value.title }}
    </nuxt-link>
    <div class="navbar-dropdown" aria-role="menuitem">
      <nuxt-link
        v-for="(sub, s) of item.value.submenus"
        :key="sub.value.page._id + s"
        class="navbar-item"
        :to="
          '/' + item.value.page.name_slug + '/' + sub.value.page.name_slug + '/'
        "
      >
        <span>{{ sub.value.title }}</span>
        <!-- <img
          src="/icon.png"
          style="width: 500px !important; height: 500px; max-width: 100vw; max-height: none"
        /> -->
      </nuxt-link>
    </div>
  </div>
  <nuxt-link
    v-else
    class="navbar-item"
    active-class="is-active"
    :to="isHomePage ? '/' : '/' + item.value.page.name_slug + '/'"
  >
    {{ item.value.title }}
  </nuxt-link>
</template>

<script>
export default {
  name: 'NavbarItem',
  props: {
    item: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    isHomePage() {
      return this.item.value.page._id === this.$store.state.website.homepage._id
    }
  }
}
</script>
