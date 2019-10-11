<template>
  <div>
    <component
      :is="tag"
      :href="item.value.path"
      :to="to"
      :rel="rel"
      :target="target"
      :title="item.value.name"
      class="icon-list-item"
      :class="{ 'has-testimonial': testimonial }"
      @click="handleClick"
    >
      <no-ssr>
        <v-lazy-image
          :src="item.value.image.path | asset({ h: size })"
          :alt="item.value.name"
          use-picture
        >
          <source
            type="image/webp"
            :srcset="item.value.image.path | asset({ h: size, fm: 'webp' })"
          />
        </v-lazy-image>
      </no-ssr>
    </component>

    <b-modal v-if="testimonial" :active.sync="showModal" :width="640">
      <div class="card" @click="closeModal">
        <div class="card-content">
          <testimonial :testimonial="testimonial" vertical />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Testimonial from '~/components/Testimonial.vue'
export default {
  name: 'IconListItem',
  components: {
    Testimonial
  },
  props: {
    item: {
      type: Object,
      default: () => null
    },
    size: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    testimonial() {
      return this.item.value.testimonial
    },
    tag() {
      const { path } = this.item.value
      if (path) {
        if (path.indexOf('http') === 0) return 'a'
        return 'nuxt-link'
      }
      return 'div'
    },
    href() {
      const { path } = this.item.value
      return this.tag === 'a' ? path : null
    },
    to() {
      const { path } = this.item.value
      return this.tag === 'nuxt-link' ? path : null
    },
    target() {
      return this.tag === 'a' ? '_blank' : null
    },
    rel() {
      return this.tag === 'a' ? 'noopener nofollow' : null
    }
  },
  methods: {
    closeModal() {
      this.showModal = false
    },
    handleClick(event) {
      if (this.testimonial) {
        event.preventDefault()
        this.showModal = true
      }
    }
  }
}
</script>

<style lang="scss">
.icon-list-item {
  opacity: 0.9;
  filter: sepia(100%);
  transition: filter 250ms ease-in-out, opacity 250ms ease-in-out;
  &:hover {
    opacity: 1;
    filter: sepia(0%);
  }
  &.has-testimonial {
    cursor: pointer;
  }
  @include mobile {
    padding: $size-7;
  }
}
</style>
