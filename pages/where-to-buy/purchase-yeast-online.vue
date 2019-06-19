<template>
  <section class="purchase-yeast-online container">
    <h2>Imperial Organic Yeast is available at the following online stores:</h2>
    <ul class="retailer-list">
      <li
        v-for="retailer of onlineRetailers"
        :key="retailer.id"
        class="retailer"
      >
        <a :href="retailer.website" rel="noopener" target="_blank">{{
          retailer.name
        }}</a>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    locations: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    onlineRetailers() {
      return this.locations.filter(l => l.online_retailer)
    },
    ...mapState({
      website: state => state.website
    })
  },
  head() {
    return {
      title: `Purchase Yeast Online | ${this.website.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Find out where to get yeast online.  ${
            this.website.name
          } is available from online homebrew retailers.`
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
          content: `Find out where to get yeast online.  ${
            this.website.name
          } is available from online homebrew retailers.`
        },
        {
          hid: 'open-graph-title',
          property: 'og:title',
          content: 'Purchase Yeast Online'
        },
        {
          hid: 'open-graph-image',
          property: 'og:image',
          content: this.website.default_sharing_image.data.url
        },
        {
          hid: 'open-graph-image-alt',
          property: 'og:image:alt',
          content: this.website.default_sharing_image.title
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
          content: `Find out where to get yeast online.  ${
            this.website.name
          } is available from online homebrew retailers.`
        },
        {
          hid: 'twitter-description',
          property: 'twitter:title',
          content: 'Purchase Yeast Online'
        },
        {
          hid: 'twitter-image',
          property: 'twitter:image',
          content: this.website.default_sharing_image.data.url
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.purchase-yeast-online {
  padding-bottom: $size-1;
  h2 {
    font-size: $size-5;
    text-align: center;
    margin-bottom: $size-5;
  }

  .retailer-list {
    display: table;
    margin: 0 auto;
    .retailer {
    }
  }
}
</style>
