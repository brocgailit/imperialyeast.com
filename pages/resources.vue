<template>
  <div>
    <component
      :is="COMPONENTS.find(c => c.name === header.component).ref"
      :layout="header"
    />
    <!-- <nav class="resources-nav container">
      <ul>
        <li>
          <nuxt-link to="/resources/faq/">
            Frequently Asked Questions
          </nuxt-link>
        </li>
        <li></li>
      </ul>
    </nav> -->

    <section class="container columns">
      <article class="column">
        <nuxt-child keep-alive :page="page" />
      </article>
      <aside class="column is-one-third">
        <component
          :is="COMPONENTS.find(c => c.name === layout.component).ref"
          v-for="(layout, l) of layouts"
          :key="l"
          :layout="layout"
        />
      </aside>
    </section>
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'

export default {
  name: 'ResourcesPage',
  mixins: [page],
  computed: {
    header() {
      return this.page.layouts.find(
        l => l.component === 'header' || l.component === 'hero'
      )
    },
    layouts() {
      return this.page.layouts.filter(l => l !== this.header)
    }
  },
  async asyncData({ params, $axios }) {
    const slug = 'resources'
    const [page] = await $axios.$get(`collections/get/pages`, {
      params: {
        'filter[name_slug]': slug,
        limit: 1,
        simple: true,
        populate: 12
      }
    })
    return { page }
  }
}
</script>

<style lang="scss" scoped>
.resources-nav {
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
