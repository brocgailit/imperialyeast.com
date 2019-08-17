<template>
  <div>
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
    <nav class="purchasing-nav container">
      <ul>
        <li>
          <nuxt-link to="/where-to-buy/" class="nav-link">
            Store Locator
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/where-to-buy/purchase-yeast-online/" class="nav-link">
            Purchase Online
          </nuxt-link>
        </li>
      </ul>
    </nav>
    <nuxt-child keep-alive :locations="locations" :page="page" />
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'

export default {
  name: 'WhereToBuyPage',
  mixins: [page],
  async asyncData({ params, $axios }) {
    const slug = 'where-to-buy'
    const locations = await $axios.$get(`collections/get/organizations`, {
      params: {
        'filter[map]': true,
        simple: true
      }
    })
    const [page] = await $axios.$get(`collections/get/pages`, {
      params: {
        'filter[name_slug]': slug,
        limit: 1,
        simple: true,
        populate: 12
      }
    })
    return { page, locations }
  }
}
</script>

<style lang="scss" scoped>
.purchasing-nav {
  text-align: center;
  margin-bottom: $size-5;
  ul {
    display: flex;
    justify-content: center;
  }

  .nav-link {
    display: inline-block;
    padding: $size-7 $size-5;
    color: $dark;
    border: 1px solid $dark;
    margin: 0 ($size-7 / 2);
    &.nuxt-link-exact-active {
      color: $white;
      background-color: $primary;
      border-color: transparent;
    }
  }
}
</style>
