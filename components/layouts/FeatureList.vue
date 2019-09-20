<template>
  <div
    :id="layout.settings.id"
    class="feature-list container"
    :class="layout.settings.class"
  >
    <h3 v-if="layout.settings.title" class="feature-list-heading">
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
        <div class="feature-content">
          <h4 class="feature-name is-4">{{ feature.value.name }}</h4>
          <div class="content">
            <p>{{ feature.value.description }}</p>
          </div>
        </div>
        <div
          v-if="feature.value.action && feature.value.action.path"
          class="action-container"
        >
          <d-button
            color="light"
            class="is-outlined"
            :url="feature.value.action.path"
            :label="feature.value.action.label || 'Learn More'"
            size="is-small"
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
    font-size: $size-3;
    margin-bottom: $size-3;
  }

  .feature-list-heading,
  .feature-name {
    font-family: $family-heading;
    text-transform: uppercase;
    text-align: center;
  }

  .feature-name {
    font-size: $size-4;
  }

  .feature {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: $size-7;
    text-align: center;
    padding-bottom: $size-6;
    height: 100%;
    flex-grow: 1;
  }
  .image {
    margin: 0 auto $size-7;
    img {
      height: 100%;
      object-fit: contain;
    }
  }
  .action-container {
    text-align: center;
  }
}
</style>
