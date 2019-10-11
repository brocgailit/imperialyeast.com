<template>
  <b-button
    v-if="url.indexOf('http') === 0"
    :id="id"
    :type="type"
    :size="size"
    tag="a"
    target="_blank"
    rel="noopener"
    :href="url"
    :class="customClass"
    :style="customStyle"
    :title="title"
  >
    {{ label }}
  </b-button>
  <b-button
    v-else-if="url.indexOf('#') === 0"
    :id="id"
    :type="type"
    :size="size"
    tag="a"
    target="_self"
    :href="url"
    :class="customClass"
    :style="customStyle"
    :title="title"
    @click.prevent="scrollToAnchor(url)"
  >
    {{ label }}
  </b-button>
  <b-button
    v-else
    :type="type"
    :size="size"
    :to="url"
    tag="router-link"
    :class="customClass"
    :style="customStyle"
    :title="title"
  >
    {{ label }}
  </b-button>
</template>

<script>
import { scrollToAnchor } from '~/assets/script/mixins'
export default {
  name: 'DynamicButton',
  mixins: [scrollToAnchor],
  props: {
    url: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    },
    customClass: {
      type: String,
      default: null
    },
    customStyle: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: ''
    }
  },
  computed: {
    type() {
      return this.color ? `is-${this.color}` : null
    }
  }
}
</script>
