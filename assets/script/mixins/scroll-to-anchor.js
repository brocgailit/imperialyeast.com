export const scrollToAnchor = {
  methods: {
    scrollToAnchor(anchor) {
      const a = document.querySelector(anchor)
      a.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  }
}
