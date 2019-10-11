<template>
  <section>
    <ul class="howto-list">
      <li
        v-for="(howto, idx) of layout.settings.howto"
        :key="howto._id"
        class="howto"
      >
        <div class="howto-content">
          <h4 class="howto-name">{{ howto.name }}</h4>
          <h5 class="howto-description">
            {{ howto.description }}
          </h5>
          <ol class="howto-steps">
            <li
              v-for="(step, s) of howto.steps"
              :id="'howto' + howto._id + '-step' + (idx + 1)"
              :key="s"
              class="howto-step"
            >
              <div v-html="step.value.text" />
              <responsive-image
                v-if="step.value.image && layout.settings.showStepImages"
                class="howto-step-image"
                :path="step.value.image.path"
                sizes="33vw"
                width="300px"
                lazy
              />
            </li>
          </ol>
        </div>
        <div class="howto-image">
          <responsive-image
            v-if="howto.image && howto.image.path"
            :path="howto.image.path"
            sizes="33vw"
            width="300px"
            lazy
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'HowToLayout',
  mixins: [component],
  jsonld() {
    const schema = this.layout.settings.howto.map(howto => {
      const h = {
        '@context': 'http://schema.org',
        '@type': 'HowTo',
        name: howto.name,
        description: howto.description,
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: howto.estimatedCost
        },
        totalTime: `P${howto.total_time}M`, // TODO: figure how to make ISO strings make sense for all situations
        step: howto.steps.map((s, i) => {
          const step = {
            '@type': 'HowToStep',
            url: `${this.$store.state.website.canonicalURL}${
              this.$route.path
            }#howto${howto._id}-step${i + 1}`,
            name: s.name,
            itemListElement: [{ '@type': 'HowToDirection', text: s.text }]
          }
          if (s.image) {
            const stepImage = s.image.data.thumbnails.find(t => t.width > 500)
            step.image = {
              '@type': 'ImageObject',
              url: stepImage.url,
              width: stepImage.width,
              height: stepImage.height
            }
          }
          return step
        })
      }

      if (howto.image) {
        h.image = {
          '@type': 'ImageObject',
          url: this.$options.filters.asset(howto.image.path),
          width: howto.image.width,
          height: howto.image.height
        }
      }

      if (howto.tools) {
        h.tool = howto.tools.map(t => ({
          '@type': 'HowToTool',
          name: t.name
        }))
      }

      if (howto.supplies) {
        h.supply = howto.supplies.map(t => ({
          '@type': 'HowToSupply',
          name: t.name
        }))
      }

      return h
    })
    return schema
  }
}
</script>

<style lang="scss">
.howto-list {
  .howto {
    display: flex;
    flex-wrap: wrap;
    .howto-content {
      flex: 0 1 60%;
    }
    .howto-image {
      flex: 0 1 40%;
    }
    @include mobile {
      .howto-content,
      .howto-image {
        flex: 1 1 100%;
      }
    }
  }
  .howto-name {
    // font-weight: $weight-bold;
    text-transform: uppercase;
    color: $grey;
    line-height: 1;
  }
  .howto-description {
    margin-top: $size-7;
    color: $black;
    font-size: $size-5;
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
</style>
