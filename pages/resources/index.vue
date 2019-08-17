<template>
  <section class="resources-home">
    <!-- <article v-for="(item, i) of menu.items" :key="i">
      <nuxt-link :to="item.path + '/'">
        <h3>
          <span>{{ item.title }}</span>
        </h3>
      </nuxt-link>
      <div v-html="item.description" />
    </article> -->
  </section>
</template>

<script>
export default {
  /* async asyncData({ params, $axios }) {
    const slug = 'resources'
    const fields = ['*.*']
    const { data: menu } = await $axios.$get(
      `items/menus?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
    )

    return { menu }
  }, */
  fetch({ params, redirect }) {
    redirect(307, '/resources/faq')
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
