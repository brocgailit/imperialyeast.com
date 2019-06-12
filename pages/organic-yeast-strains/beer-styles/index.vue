<template>
  <section class="beer-styles-page">
    <nav class="breadcrumb is-centered is-small" aria-label="breadcrumbs">
      <ul>
        <li>
          <nuxt-link to="/organic-yeast-strains"
            >Organic Yeast Strains</nuxt-link
          >
        </li>
        <li class="is-active">
          <nuxt-link
            to="/organic-yeast-strains/beer-styles/"
            aria-current="page"
            >Beer Styles</nuxt-link
          >
        </li>
      </ul>
    </nav>
    <article>
      <ul>
        <li v-for="style of styles" :key="style.id">
          <nuxt-link :to="'/organic-yeast-strains/beer-styles/' + style.slug">
            {{ style.name }}
          </nuxt-link>
        </li>
      </ul>
    </article>
  </section>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const { data: styles } = await $axios.$get(
      `items/beer_styles?filter[status]=published&fields=*.*`
    )
    return { styles }
  }
}
</script>
