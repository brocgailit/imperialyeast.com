<template>
  <div>
    <div v-if="showRootContent" id="component-container">
      <component
        :is="COMPONENTS.find(c => c.name === page.layouts[0].component).ref"
        :layout="page.layouts[0]"
      />
      <nav class="strain-type-nav container">
        <ul>
          <li>
            <nuxt-link to="/organic-yeast-strains/homebrew/" class="nav-link">
              Homebrew
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/organic-yeast-strains/commercial/" class="nav-link">
              Commercial
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
    <section v-if="page" class="container">
      <article>
        <nuxt-child :page="page" />
      </article>
    </section>
    <div v-if="page.layouts.length > 1">
      <component
        :is="COMPONENTS.find(c => c.name === layout.component).ref"
        v-for="layout of page.layouts.slice(1)"
        :key="layout.id"
        :layout="layout"
      />
    </div>
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'

export default {
  name: 'YeastStrainsPage',
  mixins: [page],
  computed: {
    showRootContent() {
      return [
        'organic-yeast-strains/homebrew/',
        'organic-yeast-strains/commercial/'
      ].some(i => this.$route.path.indexOf(i) >= 0)
    }
  },
  async asyncData({ params, $axios }) {
    const slug = 'organic-yeast-strains'
    const [page] = await $axios.$get(`collections/get/pages`, {
      params: {
        'filter[name_slug]': slug,
        limit: 1,
        simple: true,
        populate: 12,
        rspc: 1
      }
    })
    return { page }
  }
}
</script>

<style lang="scss" scoped>
.strain-type-nav {
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
