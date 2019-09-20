<template>
  <section class="resources-home">
    Redirecting to commercial strains
  </section>
</template>

<script>
export default {
  name: 'YeastStrainsDefaultPage',
  fetch({ params, redirect }) {
    redirect(307, '/organic-yeast-strains/commercial/')
  }
}
</script>
