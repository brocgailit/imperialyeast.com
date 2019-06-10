import Hero from '~/components/sections/Hero.vue'
import ContentBlock from '~/components/sections/ContentBlock.vue'
import PageHeader from '~/components/sections/PageHeader.vue'

export const DYNAMIC_COMPONENTS = [
  { name: 'content-block', ref: ContentBlock },
  { name: 'hero', ref: Hero },
  { name: 'header', ref: PageHeader }
]
