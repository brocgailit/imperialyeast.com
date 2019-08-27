<template>
  <blockquote class="testimonial-blockquote">
    <a :href="company.url" target="_blank" rel="noopener">
      <figure
        class="image testimonial-logo"
        :style="{
          height: (company.logo.height / company.logo.width) * logoWidth + 'px'
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
    <div class="quote content" v-html="testimonial.text" />

    <footer class="quote-footer">
      <div class="author-image">
        <figure
          v-for="author of testimonial.author.filter(a => a.image)"
          :key="author.image._id"
          class="image is-96x96"
        >
          <no-ssr>
            <v-lazy-image
              class="is-rounded"
              :src="
                author.image.path
                  | asset({ w: 96, h: 96, fit: 'facearea', facepad: 2 })
              "
              :alt="author.image.title"
            />
          </no-ssr>
        </figure>
      </div>
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
    </footer>
  </blockquote>
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
.testimonial-blockquote {
  // border: 1px solid $primary;
  border-radius: $radius;
  margin: $size-7 0;
  padding: $size-7;
  display: flex;
  flex-direction: column;
  align-items: center;
  .testimonial-logo {
    margin: $size-7;
  }
  .author-image {
    display: flex;
    margin: $size-7;
    .image + .image {
      transform: translateX(-20px);
      z-index: -1;
    }
  }
  .author-detail {
    line-height: 1.2;
    .author-name {
      line-height: 1;
      font-size: $size-4;
      font-family: $family-heading;
      font-weight: $weight-normal;
      text-transform: uppercase;
    }
  }
  .quote {
    font-size: $size-7;
  }
  .author-company-link {
    font-weight: $weight-bold;
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
