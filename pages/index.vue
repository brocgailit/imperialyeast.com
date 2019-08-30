<template>
  <div>
    <component
      :is="COMPONENTS.find(c => c.name === layout.component).ref"
      v-for="(layout, l) of page.layouts"
      :key="l"
      :layout="layout"
    />
  </div>
</template>

<script>
import { page } from '~/assets/script/mixins'
export default {
  name: 'HomePage',
  mixins: [page],
  jsonld() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: this.website.canonicalURL,
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: `${this.website.canonicalURL}/search/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      ]
    }
  }
}
</script>
