<template>
  <div
    :id="layout.settings.id"
    class="feature-list container"
    :class="layout.settings.class"
  >
    <h3 v-if="layout.settings.title" class="feature-list-heading title">
      {{ layout.settings.title }}
    </h3>
    <ul class="features columns">
      <li
        v-for="(feature, f) of layout.settings.features"
        :key="f"
        class="feature column"
      >
        <figure
          v-if="feature.value.icon && feature.value.icon.path"
          class="image is-128x128"
        >
          <responsive-image
            v-if="feature.value.icon"
            :path="feature.value.icon.path"
            sizes="33vw"
            lazy
          />
        </figure>
        <h4 class="feature-name title is-6">{{ feature.value.name }}</h4>
        <p class="content">
          {{ feature.value.description }}
        </p>
        <div>
          <d-button
            type="is-primary"
            :url="feature.value.path"
            :label="layout.settings.text"
            size="is-medium"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'FeatureListLayout',
  mixins: [component]
}
</script>

<style lang="scss">
.feature-list {
  .feature-list-heading {
    margin-bottom: $size-3;
  }
  .content {
    text-align: center;
  }
  .image {
    margin: 0 auto $size-7;
    img {
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
