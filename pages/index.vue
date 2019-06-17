<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'
export default {
  data() {
    return {
      DYNAMIC_COMPONENTS
    }
  },
  jsonld() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: this.website.canonical_url,
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: `${this.website.canonical_url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      website: state => state.website
    })
  },
  async asyncData({ params, $axios }) {
    const slug = 'home'
    const fields = [
      '*.*',
      'layouts.*.*',
      'layouts.forms.fields.*',
      'layouts.forms.*'
    ]
    const page = await $axios
      .$get(`items/pages?single=1&slug=${slug}&fields=${fields.join(',')}`)
      .then(res => res.data)
    return { page }
  }
}
</script>
