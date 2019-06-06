import Hero from '~/components/sections/Hero.vue'
import ContentBlock from '~/components/sections/ContentBlock.vue'

export const DYNAMIC_COMPONENTS = [
  { name: 'content-block', ref: ContentBlock },
  { name: 'hero', ref: Hero }
]
