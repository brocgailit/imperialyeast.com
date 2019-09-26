<template>
  <div
    :id="layout.settings.id"
    class="columns"
    :class="layout.settings.class"
    :style="layout.settings.style"
  >
    <div
      v-for="(column, c) of columns"
      :id="column.settings.id"
      :key="c"
      class="column"
      :class="column.settings.class"
      :style="column.settings.style"
    >
      <component
        :is="COMPONENTS.find(c => c.name === layout.component).ref"
        v-for="(layout, l) of column.children"
        :key="l"
        :layout="layout"
      />
    </div>
  </div>
</template>

<script>
import { COMPONENTS } from '~/assets/script/components'
import { component } from '~/assets/script/mixins'

export default {
  name: 'GridLayout',
  mixins: [component],
  data() {
    return {
      COMPONENTS
    }
  },
  computed: {
    columns() {
      return this.layout.columns
    }
  }
}
</script>
