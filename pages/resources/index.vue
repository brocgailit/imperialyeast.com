<template>
  <section class="resources-home">
    <article>
      <nuxt-link to="/resources/faq">
        <h3>
          <span>Frequently Asked Questions</span>
        </h3>
      </nuxt-link>
    </article>
  </section>
</template>

<style lang="scss">
.resources-home {
  h3 {
    @include brand-font;
    font-size: $size-2;
  }
}
</style>
