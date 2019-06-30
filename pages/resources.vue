<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === header.type).ref"
      :layout="header"
    />
    <!-- <nav class="resources-nav container">
      <ul>
        <li>
          <nuxt-link to="/resources/faq/">
            Frequently Asked Questions
          </nuxt-link>
        </li>
        <li></li>
      </ul>
    </nav> -->
    <section class="resources-section container">
      <div class="resources-main-content">
        <component
          :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
          v-for="layout of layouts"
          :key="layout.id"
          :layout="layout"
        />
        <nuxt-child keep-alive :page="page" />
      </div>
      <aside>
        <component
          :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
          v-for="layout of sidebar"
          :key="layout.id"
          :layout="layout"
        />

        <ul class="howto-list">
          <li v-for="(howto, idx) of howtos" :key="howto.id" class="howto">
            <div>
              <h4 class="howto-name">{{ howto.name }}</h4>
              <h5 class="howto-description">
                {{ howto.description }}
              </h5>
              <ol class="howto-steps">
                <li
                  v-for="(step, s) of howto.steps"
                  :id="'howto' + howto.id + '-step' + (idx + 1)"
                  :key="s"
                  class="howto-step"
                >
                  <p>{{ step.text }}</p>
                  <responsive-image
                    v-if="step.image"
                    class="howto-step-image"
                    :file="step.image"
                    sizes="33vw"
                    lazy
                  />
                </li>
              </ol>
            </div>
          </li>
        </ul>
      </aside>
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
    }),
    header() {
      return this.page.layouts.find(
        l => l.type === 'header' || l.type === 'hero'
      )
    },
    layouts() {
      return this.page.layouts.filter(l => l !== this.header && !l.sidebar)
    },
    sidebar() {
      return this.page.layouts.filter(l => l !== this.header && l.sidebar)
    }
  },
  jsonld() {
    const schema = this.howtos.map(howto => {
      const image = [...howto.steps]
        .reverse()
        .find(s => s.image)
        .image.data.thumbnails.find(t => t.width > 500)
      const h = {
        '@context': 'http://schema.org',
        '@type': 'HowTo',
        name: howto.name,
        description: howto.description,
        image: {
          '@type': 'ImageObject',
          url: image.url,
          width: image.width,
          height: image.height
        },
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: howto.estimated_cost
        },
        totalTime: `P${howto.total_time}M`, // TODO: figure how to make ISO strings make sense for all situations
        step: howto.steps.map((s, i) => {
          const step = {
            '@type': 'HowToStep',
            url: `${this.website.canonical_url}/faq#howto${howto.id}-step${i +
              1}`,
            name: s.name,
            itemListElement: [{ '@type': 'HowToDirection', text: s.text }]
          }
          if (s.image) {
            const stepImage = s.image.data.thumbnails.find(t => t.width > 500)
            step.image = {
              '@type': 'ImageObject',
              url: stepImage.url,
              width: stepImage.width,
              height: stepImage.height
            }
          }
          return step
        })
      }

      if (howto.tools) {
        h.tool = howto.tools.map(t => ({
          '@type': 'HowToTool',
          name: t.name
        }))
      }

      if (howto.supplies) {
        h.supply = howto.supplies.map(t => ({
          '@type': 'HowToSupply',
          name: t.name
        }))
      }

      return h
    })
    return schema
  },
  async asyncData({ params, $axios }) {
    const slug = 'resources'
    const fields = ['*.*', 'layouts.*.*']
    const page = await $axios
      .$get(
        `items/pages?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)

    const howtos = await $axios
      .$get(`items/how_tos?filter[status]=published&fields=*.*`)
      .then(res => res.data)

    return { page, howtos }
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

<style lang="scss" scoped>
.resources-nav {
  text-align: center;
  margin-bottom: $size-5;
  ul {
    display: flex;
    justify-content: center;
  }

  .nav-link {
    display: inline-block;
    padding: $size-7 $size-5;
    color: $dark;
    border: 1px solid $dark;
    margin: 0 ($size-7 / 2);
    &.nuxt-link-exact-active {
      color: $white;
      background-color: $primary;
      border-color: transparent;
    }
  }
}

.resources-section {
  display: flex;
  .resources-main-content {
    flex-grow: 1;
    padding: 0 $size-7;
    @include desktop {
      margin-right: $size-5;
    }
  }
  aside {
    flex: 0 0 33%;
    .content-block {
      padding: $size-5 0;
      &:first-child {
        padding-top: 0;
      }
      ::v-deep {
        h3 {
          font-size: $size-3;
        }
        p {
          font-size: $size-7;
        }
      }
    }
  }
}

@include touch {
  .resources-section {
    display: block;
  }
}

.howto-list {
  padding: $size-5;
  .howto-name {
    font-weight: $weight-bold;
    color: $grey;
    line-height: 1;
  }
  .howto-description {
    margin-top: $size-5;
    color: $black;
    font-size: $size-4;
    line-height: 1.1;
    font-weight: $weight-bold;
  }

  .howto-steps {
    .howto-step {
      margin-left: 1rem;
      margin-top: $size-5;
      .howto-step-image {
        display: block;
        text-align: center;
        margin: $size-5 auto 0;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
