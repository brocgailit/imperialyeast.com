<template>
  <picture v-if="!lazy" :style="{ width, height }" class="responsive-image">
    <source
      :srcset="path | srcset({ format: 'webp' })"
      :sizes="sizes"
      type="image/webp"
    />
    <source :srcset="path | srcset" :sizes="sizes" :type="path | fileType" />
    <img :src="path + '?w=375'" :alt="alt" />
  </picture>
  <client-only v-else>
    <v-lazy-image
      use-picture
      :alt="alt"
      :src="path + '?w=375'"
      :style="{ width: width, height }"
      class="responsive-image"
    >
      <source
        :srcset="path | srcset({ format: 'webp' })"
        :sizes="sizes"
        type="image/webp"
      />
      <source :srcset="path | srcset" :sizes="sizes" :type="path | fileType" />
    </v-lazy-image>
  </client-only>
</template>

<script>
const DEFAULT_BREAKPOINTS = [375, 768, 1024, 1280, 1920]
export default {
  name: 'ResponsiveImage',
  filters: {
    fileType(path) {
      const extension = path.split('.').pop()
      const format = extension === 'jpg' ? 'jpeg' : extension
      if (!['jpeg', 'png', 'gif', 'webp'].includes(format))
        throw new Error('Not a valid file type.')
      return `image/${format}`
    },
    srcset(image, options = {}) {
      const { format, breakpoints, quality, fit } = options
      return (breakpoints || DEFAULT_BREAKPOINTS)
        .map(w => {
          // TODO: use set width/heights or ratio based on such
          const prefix =
            image.indexOf('http') !== 0
              ? `${process.env.COCKPIT_CDN}/assets`
              : ''
          const path = `${prefix}${image}?w=${w}&fit=${fit ||
            'clip'}&q=${quality || 90}`
          return path + (format ? `&fm=${format}` : '') + ` ${w}w`
        })
        .join(',')
    }
  },
  props: {
    path: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ''
    },
    sizes: {
      type: String,
      default: '75vw'
    },
    width: {
      type: [String, Number],
      default: null
    },
    height: {
      type: [String, Number],
      default: null
    },
    fit: {
      type: String,
      default: 'clip'
    },
    lazy: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.responsive-image {
  max-width: 100%;
  img {
    width: 100%;
    object-fit: contain;
  }
}
</style>
