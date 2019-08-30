<template>
  <div
    v-if="item.value.submenus"
    ref="item"
    class="navbar-item has-dropdown is-hoverable"
  >
    <nuxt-link
      :id="item.value.page.name_slug"
      role="button"
      class="navbar-link"
      aria-haspopup="true"
      :aria-controls="item.value.page.name_slug + '-menu'"
      :to="isHomePage ? '/' : '/' + item.value.page.name_slug + '/'"
    >
      {{ item.value.title }}
    </nuxt-link>
    <div
      :id="item.value.page.name_slug + '-menu'"
      class="navbar-dropdown"
      role="menu"
      tabindex="-1"
      :aria-labelledby="item.value.page.name_slug"
      @click="clearFocus"
    >
      <nuxt-link
        v-for="(sub, s) of item.value.submenus"
        :key="sub.value.page._id + s"
        role="menuitem"
        class="navbar-item"
        tabindex="-1"
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
  },
  methods: {
    clearFocus(event) {
      // CSS uses :focus-within to activate ...  so need to blur to remove
      const blur = el => {
        if (el.blur) el.blur()
        if (el.childNodes) [...el.childNodes].forEach(blur)
      }
      blur(this.$refs.item)
    }
  }
}
</script>
