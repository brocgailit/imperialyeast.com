import supportsWebP from 'supports-webp'

export const component = {
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
