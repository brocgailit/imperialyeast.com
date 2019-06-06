<template>
  <div>
    <h1>Pitches for Commercial and Homebrewing</h1>
    <h2>Organic Yeast Grown in Portland, Oregon</h2>
    <section v-for="layout of page.layouts" :key="layout.id" class="section">
      {{ layout.attachments }}
      <p>
        We pack 200 billion cells into every pouch!
      </p>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const slug = 'home'
    const fields = [
      '*.*',
      'layouts.*.*',
      'layouts.attachments.directus_files_id.title',
      'layouts.attachments.directus_files_id.type',
      'layouts.attachments.directus_files_id.data.*.*'
    ]
    const page = await $axios
      .$get(`items/pages?single=1&slug=${slug}&fields=${fields.join(',')}`)
      .then(res => res.data)
    return { page }
  }
}
</script>
