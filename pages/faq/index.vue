<template>
  <div>
    <component
      :is="DYNAMIC_COMPONENTS.find(c => c.name === layout.type).ref"
      v-for="layout of page.layouts"
      :key="layout.id"
      :layout="layout"
    />
    <section class="faq-section">
      <div class="container">
        <article class="faqs">
          <ul class="faq-list">
            <li v-for="item of faq" :key="item.id" class="faq-list-item">
              <h3 class="question">
                {{ item.question }}
              </h3>
              <div class="answer" v-html="item.answer" />
            </li>
          </ul>
        </article>
        <aside class="howtos">
          <ul class="howto-list">
            <li v-for="howto of howtos" :key="howto.id" class="howto">
              <div>
                <h4 class="howto-name">{{ howto.name }}</h4>
                <h5 class="howto-description">
                  {{ howto.description }}
                </h5>
                <ol class="howto-steps">
                  <li
                    v-for="(step, s) of howto.steps"
                    :key="s"
                    class="howto-step"
                  >
                    <p>{{ step.text }}</p>
                    <responsive-image
                      v-if="step.image"
                      class="howto-step-image"
                      :file="step.image"
                      sizes="33vw"
                      lazy
                    />
                  </li>
                </ol>
              </div>
            </li>
          </ul>
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
    const howtos = await $axios
      .$get(`items/how_tos?filter[status]=published&fields=*.*`)
      .then(res => res.data)
    const page = await $axios
      .$get(
        `items/pages?single=1&filter[slug]=${slug}&fields=${fields.join(',')}`
      )
      .then(res => res.data)
    return { page, faq, howtos }
  }
}
</script>

<style lang="scss">
.faq-section {
  padding-bottom: $size-1;
  .container {
    display: flex;
  }
  .faq-list {
    flex-grow: 1;
    margin-right: $size-5;
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

  .howtos {
    flex: 0 0 33%;

    .howto-list {
      background-color: $light;
      padding: $size-5;
    }

    .howto-name {
      font-weight: $weight-bold;
      color: $grey;
      line-height: 1;
    }
    .howto-description {
      margin-top: $size-5;
      color: $black;
      font-size: $size-4;
      line-height: 1.1;
      font-weight: $weight-bold;
    }

    .howto-steps {
      .howto-step {
        margin-left: 1rem;
        margin-top: $size-5;
        .howto-step-image {
          display: block;
          text-align: center;
          margin: $size-5 auto 0;
          img {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
