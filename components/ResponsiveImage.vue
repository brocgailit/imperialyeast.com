<template>
  <picture v-if="!lazy">
    <source
      :srcset="file | srcset({ format: 'webp' })"
      :sizes="sizes"
      type="image/webp"
    />
    <source :srcset="file | srcset" sizes="100vw" :type="file.type" />
    <img
      :src="file.data.thumbnails.find(t => t.width === 375).url"
      :alt="alt || file.title"
    />
  </picture>
  <no-ssr v-else>
    <v-lazy-image
      use-picture
      :alt="alt || file.title"
      :src="file.data.thumbnails.find(t => t.width === 375).url"
    >
      <source
        :srcset="file | srcset({ format: 'webp' })"
        :sizes="sizes"
        type="image/webp"
      />
      <source :srcset="file | srcset" :sizes="sizes" :type="file.type" />
    </v-lazy-image>
  </no-ssr>
</template>

<script>
const DEFAULT_BREAKPOINTS = [375, 768, 1024, 1280, 1920]
export default {
  filters: {
    srcset(image, options = {}) {
      const { format, breakpoints, quality, fit } = options
      return (breakpoints || DEFAULT_BREAKPOINTS)
        .map(w => {
          const URLParser =
            typeof URL !== 'undefined' ? URL : require('url').URL
          const { url, width, height } = image.data.thumbnails.find(
            t => t.width === w
          ) // TODO: find nearest breakpoint
          const path = `//${
            new URLParser(url).hostname
          }/thumbnail/_/${width}/${height}/${fit || 'contain'}/${quality ||
            'better'}/${image.filename}`
          return path + (format ? `?format=${format}` : '') + ` ${width}w`
        })
        .join(',')
    }
  },
  props: {
    file: {
      type: Object
    },
    alt: {
      type: String
    },
    sizes: {
      type: String,
      default: '100vw'
    },
    fit: {
      type: String,
      default: 'contain'
    },
    lazy: {
      type: Boolean,
      default: false
    }
  }
}
</script>
