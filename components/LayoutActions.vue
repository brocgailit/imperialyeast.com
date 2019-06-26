<template>
  <div class="layout-actions">
    <span v-for="action of actions" :key="action.id">
      <a
        v-if="action.attachment"
        target="_blank"
        rel="noopener"
        :href="action.attachment.data.url"
        :title="action.title"
        :class="{
          'button is-primary is-medium': action.style !== '1'
        }"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fal', 'arrow-to-bottom']" />
        </span>
        <span>{{ action.label }}</span>
      </a>
      <nuxt-link
        v-else
        :to="action.path"
        :title="action.title"
        :class="{ 'button is-primary is-medium': action.style !== '1' }"
      >
        {{ action.label }}
      </nuxt-link>
    </span>
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

<style lang="scss">
@include mobile {
  .button.is-medium {
    font-size: 1rem;
  }
}
.layout-actions {
  > * {
    display: inline-block;
    margin: 4px;
  }
}
</style>
