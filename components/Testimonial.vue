<template>
  <div class="business-testimonial">
    <a :href="company.url" target="_blank" rel="noopener">
      <figure
        class="image testimonial-logo"
        :style="{
          height: (company.logo.height / company.logo.width) * logoWidth + 'px',
          width: logoWidth + 'px'
        }"
      >
        <no-ssr>
          <v-lazy-image
            :src="company.logo.path | asset({ w: logoWidth, fit: 'clip' })"
            :alt="company.logo.title"
          />
        </no-ssr>
      </figure>
    </a>
    <blockquote class="quote">
      <div class="content" v-html="testimonial.text" />
      <div class="author-detail">
        <span v-html="author" /><br />
        <a
          class="author-company-link"
          :href="company.url"
          target="_blank"
          rel="noopener"
        >
          {{ company.name }}
        </a>
      </div>
    </blockquote>
  </div>
</template>

<script>
export default {
  props: {
    testimonial: {
      type: Object,
      default: () => null
    },
    logoWidth: {
      type: Number,
      default: 200
    }
  },
  computed: {
    author() {
      if (
        this.testimonial.author.length > 1 &&
        this.testimonial.author.every(
          author => author.jobTitle === this.testimonial.author[0].jobTitle
        )
      ) {
        return `
          <strong class="author-name">${this.testimonial.author
            .map(a => a.name)
            .join(' and ')}</strong><br>
          ${this.testimonial.author[0].jobTitle}s
        `
      }
      return this.testimonial.author
        .map(a => {
          return `<strong class="author-name">${a.name}</strong><br>${
            a.jobTitle
          }`
        })
        .join(' and ')
    },
    company() {
      return this.testimonial.author.find(a => a.worksFor && a.worksFor.length)
        .worksFor[0]
    }
  }
}
</script>

<style lang="scss">
.business-testimonial {
  // border: 1px solid $primary;
  border-radius: $radius;
  margin: $size-7 0;
  padding: $size-7;
  display: flex;
  align-items: flex-start;
  .testimonial-logo {
    margin: $size-7;
  }
  .author-image {
    display: flex;
    .image + .image {
      transform: translateX(-20px);
      z-index: -1;
    }
  }
  .author-detail {
    font-size: $size-7;
    line-height: 1.2;
    .author-name {
      line-height: 1;
      font-size: $size-5;
      font-family: $family-heading;
      font-weight: $weight-normal;
      text-transform: uppercase;
    }

    .author-company-link {
      font-weight: $weight-bold;
    }
  }
  .quote {
    width: 100%;
    padding: $size-6;
    font-size: $size-7;
    // text-align: center;
    .content {
      font-size: $size-6 * 1.1;
      opacity: 0.9;
      // font-style: italic;
    }
  }
  .quote-footer {
    display: flex;
    align-items: center;
    @include mobile {
      flex-direction: column;
      text-align: center;
    }
  }
}
</style>
