<template>
  <section class="search-results-section">
    <header class="container">
      <h1>Search</h1>
      <h2>
        Results for <strong>{{ searchTerm }}</strong>
      </h2>
    </header>
    <!-- Results -->
    <ul class="container">
      <li v-if="strains.length">
        <h3 class="result-type-name">Strains</h3>
        <ul>
          <li v-for="strain of strains" :key="strain.id">
            <h4>{{ strain.name }}</h4>
            <p>{{ strain.short_description }}</p>
          </li>
        </ul>
      </li>
      <li v-if="locations.length">
        <h3 class="result-type-name">Where to Buy</h3>
        <ul>
          <li v-for="location of locations" :key="location.id">
            <h4>{{ location.name }}</h4>
            <p>
              {{ location.city }}, {{ location.state }} {{ location.region }}
            </p>
          </li>
        </ul>
      </li>
      <li v-if="pages.length">
        <h3 class="result-type-name">Pages</h3>
        <ul>
          <li v-for="page of pages" :key="page.id">
            <h4>{{ page.name }}</h4>
            <p>{{ page.description }}</p>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  watchQuery: ['q'],
  async asyncData({ query, $axios }) {
    const { q } = query

    const createFilterString = fields =>
      fields
        .map((f, i) => `filter[${f}][logical]=or&filter[${f}][contains]=${q}`)
        .join('&')

    // search strains
    const strainFilters = createFilterString([
      'name',
      'short_description',
      'full_description',
      'compare_to'
    ])

    const strains = await $axios
      .$get(`items/strains?${strainFilters}&filter[status]=published`)
      .then(res => res.data)

    // search locations
    const locationFilters = createFilterString([
      'name',
      'city',
      'state',
      'postal_code',
      'phone'
    ])
    const locations = await $axios
      .$get(
        `items/purchase_locations?${locationFilters}&filter[status]=published`
      )
      .then(res => res.data)

    // search pages
    const pageFilters = createFilterString(['name', 'layouts.body'])
    const pages = await $axios
      .$get(
        `items/pages?fields=*.*,layouts.*&${pageFilters}&filter[status]=published`
      )
      .then(res => res.data)

    return { searchTerm: q, strains, pages, locations }
  }
}
</script>

<style lang="scss">
.search-results-section {
  .result-type-name {
    font-family: $family-heading;
    font-size: $size-3;
  }
}
</style>
