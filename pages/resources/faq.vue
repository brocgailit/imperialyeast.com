<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
    <section class="faq-section">
      <div class="container">
        <article class="faqs">
          <ul class="faq-list">
            <li v-for="item of faq" :key="item.id" class="faq-list-item">
              <b-collapse :open="false" :aria-id="'question' + item.id">
                <div
                  slot="trigger"
                  slot-scope="props"
                  class="question-header"
                  :aria-controls="'question' + item.id"
                >
                  <h3 class="question">
                    {{ item.question }}
                  </h3>
                  <fa-icon
                    class="toggle-icon"
                    :icon="['fal', 'chevron-right']"
                    :class="{ 'fa-rotate-90': props.open }"
                  />
                </div>
                <div class="answer" v-html="item.answer" />
              </b-collapse>
            </li>
          </ul>
        </article>
      </div>
    </section>
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
  computed: {
    ...mapState({
      website: state => state.website
    })
  },
  jsonld() {
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faq.map(q => ({
        '@type': 'Question',
        name: q.question,
        dateCreated: q.created_on,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer.replace(/(<([^>]+)>)/gi, ''),
          dateCreated: q.modified_on
        }
      }))
    }
    return schema
  },
  async asyncData({ params, $axios }) {
    const slug = 'faq'
    const fields = ['*.*', 'layouts.*.*']
    const faq = await $axios
      .$get(`items/frequent_questions?filter[status]=published&fields=*.*`)
      .then(res => res.data)
    const page = await $axios
      .$get(
        `items/pages?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)
    return { page, faq }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: this.website.canonical_url + this.$route.path + '/'
        }
      ],
      title: `${this.page.title} | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description
        },
        {
          hid: 'open-graph-url',
          property: 'og:url',
          content: `${this.website.canonical_url}${this.$route.path}`
        },
        {
          hid: 'open-graph-type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'open-graph-description',
          property: 'og:description',
          content: this.page.description
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: this.page.title
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.data.url
            : this.website.default_sharing_image.data.url
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.title
            : this.website.default_sharing_image.title
        },
        {
          hid: 'twitter-card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter-site',
          property: 'twitter:site',
          content: `@${this.website.twitter_handle}`
        },
        {
          hid: 'twitter-description',
          property: 'twitter:description',
          content: this.page.description
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: this.page.title
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.page.social_sharing_image
            ? this.page.social_sharing_image.data.url
            : this.website.default_sharing_image.data.url
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.faq-section {
  padding-bottom: $size-1;
  .faq-list {
    @include desktop {
      margin-right: $size-5;
    }
    .faq-list-item {
      margin-bottom: $size-5;
      border-bottom: 1px solid $grey;

      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $size-7;
        cursor: pointer;
      }

      .toggle-icon {
        transition: 250ms ease-in-out;
      }

      .question {
        display: flex;
        align-items: center;
        font-weight: $weight-bold;
        font-size: $size-5;
        line-height: 1.1;
        padding-right: $size-7;
        &:before {
          content: 'Q';
          font-weight: $weight-bold;
          font-size: $size-4;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          background-color: $primary;
          color: $white;
          border-radius: 5px;
          flex: 0 0 50px;
          width: 50px;
          height: 50px;
          margin: 0 $size-7;
        }
        &:after {
          content: '';
          clear: both;
          display: table;
        }
      }

      .answer {
        padding: $size-7 $size-7 $size-4;
      }
    }
  }

  @include touch {
    padding-bottom: 0;
    .faq-list {
      .faq-list-item {
        .question {
          font-size: $size-6;
          margin-bottom: 0;
        }
        .answer {
          font-size: $size-7;
        }
      }
    }
  }
}
</style>
