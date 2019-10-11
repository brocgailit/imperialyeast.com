<template>
  <div class="level icon-list" :style="{ 'min-height': size + 'px' }">
    <div v-for="(item, i) of icons" :key="i" class="level-item is-narrow">
      <icon-list-item :item="item" :size="size" />
    </div>
  </div>
</template>
<script>
import IconListItem from '~/components/IconListItem.vue'
export default {
  name: 'IconList',
  components: {
    IconListItem
  },
  props: {
    icons: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: 100
    }
  }
}
</script>

<style lang="scss">
.icon-list {
  margin-bottom: $size-3;
  justify-content: space-around;

  .level-item {
    text-align: center;
  }
}
</style>
