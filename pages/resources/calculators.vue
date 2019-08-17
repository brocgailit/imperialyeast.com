<template>
  <div>
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
    <section class="calculators-section">
      <calculator-pitch />
      <calculator-gravity-conversion />
    </section>
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'
import CalculatorPitch from '~/components/CalculatorPitch.vue'
import CalculatorGravityConversion from '~/components/CalculatorGravityConversion.vue'
export default {
  name: 'calculators',
  components: {
    CalculatorPitch,
    CalculatorGravityConversion
  },
  mixins: [page],
  async asyncData({ params, $axios }) {
    const slug = 'calculators'
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

<style lang="scss">
.calculators-section {
  padding-bottom: $size-1;

  @include touch {
    padding-bottom: 0;
  }
}
</style>
