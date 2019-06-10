<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
    <section>
      <div class="container">
        <article>
          <ul class="faq-list">
            <li v-for="item of faq" :key="item.id" class="faq-list-item">
              <h3 class="question">
                {{ item.question }}
              </h3>
              <div class="answer" v-html="item.answer" />
            </li>
          </ul>
        </article>
        <aside>
          stuff
        </aside>
      </div>
    </section>
  </div>
</template>

<script>
import { DYNAMIC_COMPONENTS } from '~/assets/script/dynamic-components'
export default {
  data() {
    return {
      DYNAMIC_COMPONENTS
    }
  },
  computed: {},
  async asyncData({ params, $axios }) {
    const slug = 'faq'
    const fields = ['*.*', 'layouts.*.*']
    const faq = await $axios
      .$get(`items/frequent_questions?filter[status]=published&fields=*.*`)
      .then(res => res.data)
    const page = await $axios
      .$get(
        `items/pages?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)
    return { page, faq }
  }
}
</script>

<style lang="scss">
.faq-list {
  .faq-list-item {
    margin-bottom: $size-5;
    &:before {
      content: 'Q';
      font-weight: $weight-bold;
      font-size: $size-4;
      display: flex;
      justify-content: center;
      align-items: center;
      float: left;
      background-color: $primary;
      color: $white;
      border-radius: 5px;
      width: 50px;
      height: 50px;
      margin: 0 $size-7 $size-7;
    }

    .question {
      font-weight: $weight-bold;
      font-size: $size-5;
      line-height: 1.1;
      margin-bottom: $size-7;
    }
  }
}
</style>
