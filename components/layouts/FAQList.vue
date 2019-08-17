<template>
  <section class="faq-section">
    <div class="container">
      <article class="faqs">
        <ul class="faq-list">
          <li
            v-for="item of layout.settings.questions"
            :key="item._id"
            class="faq-list-item"
          >
            <b-collapse :open="false" :aria-id="'question' + item._id">
              <div
                slot="trigger"
                slot-scope="props"
                class="question-header"
                :aria-controls="'question' + item._id"
              >
                <h3 class="question">
                  {{ item.question }}
                </h3>
                <fa-icon
                  class="toggle-icon"
                  :icon="['fal', 'chevron-right']"
                  :class="{ 'fa-rotate-90': props.open }"
                />
              </div>
              <div class="answer" v-html="item.answer" />
            </b-collapse>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'FAQListLayout',
  mixins: [component],
  jsonld() {
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.layout.settings.questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        dateCreated: q._created,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer.replace(/(<([^>]+)>)/gi, ''),
          dateCreated: q._modified
        }
      }))
    }
    return schema
  }
}
</script>

<style lang="scss">
.faq-section {
  padding-bottom: $size-1;
  .faq-list {
    @include desktop {
      margin-right: $size-5;
    }
    .faq-list-item {
      margin-bottom: $size-5;
      border-bottom: 1px solid $grey;

      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $size-7;
        cursor: pointer;
      }

      .toggle-icon {
        transition: 250ms ease-in-out;
      }

      .question {
        display: flex;
        align-items: center;
        font-weight: $weight-bold;
        font-size: $size-6;
        line-height: 1.1;
        padding-right: $size-7;
        &:before {
          content: 'Q';
          font-weight: $weight-bold;
          font-size: $size-5;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          background-color: $primary;
          color: $white;
          border-radius: 5px;
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          margin: 0 $size-7;
        }
        &:after {
          content: '';
          clear: both;
          display: table;
        }
      }

      .answer {
        padding: $size-7 $size-7 $size-4;
      }
    }
  }

  @include touch {
    padding-bottom: 0;
    .faq-list {
      .faq-list-item {
        .question {
          font-size: $size-6;
          margin-bottom: 0;
        }
        .answer {
          font-size: $size-7;
        }
      }
    }
  }
}
</style>
