<template>
  <section class="resources-home">
    Redirecting to homebrew
  </section>
</template>

<script>
export default {
  name: 'YeastStrainsDefaultPage',
  fetch({ params, redirect }) {
    redirect(307, '/organic-yeast-strains/homebrew/')
  }
}
</script>
