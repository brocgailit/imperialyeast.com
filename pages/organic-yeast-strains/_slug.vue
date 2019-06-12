<template>
  <section class="strain-detail">
    <header
      class="container"
      :style="{ color: strain.strain_type.packaging_color }"
    >
      <h1>{{ strain.strain_type.name }}</h1>
      <h2>{{ strain.product_code }} {{ strain.name }}</h2>
      <p v-if="strain.guaranteed_in_stock">
        <nuxt-link to="/in-stock-or-your-order-ships-free"
          >Guaranteed In Stock or your order ships FREE!</nuxt-link
        >
      </p>
    </header>
    <div class="container">
      <p class="strain-description">
        {{ strain.short_description }}
      </p>
      <dl class="strain-detail">
        <dt class="strain-detail-name">
          <abbr title="Temperature">Temp</abbr>:
        </dt>
        <dd class="strain-detail-info">
          {{ strain.temperature_min }}–{{ strain.temperature_max }}℉
          {{ strain.temperature_min | celsius }}–{{
            strain.temperature_max | celsius
          }}℃
        </dd>
        <dt class="strain-detail-name">Flocculation:</dt>
        <dd class="strain-detail-info">
          {{ strain.flocculation | flocculation }}
        </dd>
        <dt class="strain-detail-name">Attenuation:</dt>
        <dd class="strain-detail-info">
          {{ strain.attenuation_min }}–{{ strain.attenuation_max }}%
        </dd>
      </dl>

      <div>
        Compare to:
        <ul>
          <li v-for="(comparison, c) of strain.compare_to" :key="c">
            {{ comparison }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  filters: {
    celsius: f => Math.round(((f - 32) * 5) / 9),
    flocculation(val) {
      return [
        'Very Low',
        'Low',
        'Med-Low',
        'Medium',
        'Med-High',
        'High',
        'Very High'
      ][val]
    }
  },
  async asyncData({ params, $axios }) {
    const { slug } = params
    const strain = await $axios
      .$get(
        `items/strains?single=1&filter[slug]=${slug}&fields=*.*,strain_type.*,beer_styles.*.*`
      )
      .then(res => res.data)
    return { strain }
  }
}
</script>

<style lang="scss">
.strain-detail {
  header {
    text-align: center;
  }
}
</style>
