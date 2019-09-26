<template>
  <div>
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
  },
  created: function() {
    this.showRootContent = [
      'organic-yeast-strains/homebrew/',
      'organic-yeast-strains/commercial/'
    ].some(i => this.$route.path.indexOf(i) > -1)
  }
}
</script>

<style lang="scss">
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
