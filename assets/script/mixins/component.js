import supportsWebP from 'supports-webp'

export default {
  data() {
    return {
      supportsWebP: true
    }
  },
  props: {
    layout: {
      type: Object,
      default: () => null
    }
  },
  async mounted() {
    this.supportsWebP = await supportsWebP
  }
}
