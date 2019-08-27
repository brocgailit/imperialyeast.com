<template>
  <div
    :id="layout.settings.id"
    class="container"
    :class="layout.settings.class"
    :style="layout.settings.style"
  >
    <ul class="testimonial-list">
      <li
        v-for="testimonial of testimonials"
        :key="testimonial._id"
        class="testimonial "
      >
        <testimonial :testimonial="testimonial" />
      </li>
    </ul>
  </div>
</template>

<script>
import Testimonial from '~/components/Testimonial.vue'
import { component } from '~/assets/script/mixins'
export default {
  name: 'TestimonialsLayout',
  components: {
    Testimonial
  },
  mixins: [component],
  computed: {
    testimonials() {
      return this.layout.settings.testimonials || []
    }
  }
}
</script>
