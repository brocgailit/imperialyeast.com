<template>
  <div class="layout-actions">
    <router-link
      v-for="action of actions"
      :key="action.id"
      :to="action.path"
      :title="action.title"
      class="button is-primary is-medium"
    >
      {{ action.label }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: () => []
    }
  }
}
</script>
