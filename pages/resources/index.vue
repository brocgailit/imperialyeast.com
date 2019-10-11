<template>
  <div class="resources-main-content">
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'
export default {
  name: 'ResourcesDefaultPage',
  mixins: [page],
  scrollToTop: true,
  async asyncData({ params, $axios }) {
    const slug = 'resources-main-content'
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

<style lang="scss">
@keyframes expand {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
.resources-home {
  a {
    &:hover {
      color: darken($primary, 3%);
    }
  }
  h3 {
    position: relative;
    @include brand-font;
    font-size: $size-2;
    span {
      display: inline-block;
      background-color: $white;
      padding-right: $size-7;
    }
    &:before {
      z-index: -1;
      position: absolute;
      content: '';
      width: 100%;
      border: 1px solid $dark;
      top: 50%;
      transform-origin: left;
      animation: expand 500ms ease-out forwards;
    }
    &:after {
      content: 'EXPLORE';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      padding-left: $size-7;
      background-color: $white;
      font-size: $size-5;
    }
  }

  p {
    margin: $size-5 0;
  }
}
</style>
