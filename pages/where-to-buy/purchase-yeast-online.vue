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
