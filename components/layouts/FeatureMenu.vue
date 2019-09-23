<template>
  <div
    :id="layout.settings.id"
    class="feature-menu container"
    :class="layout.settings.class"
  >
    <ul class="features columns">
      <li
        v-for="(feature, f) of layout.settings.features.items"
        :key="f"
        class="feature column"
      >
        <div v-if="feature.value.icon" class="feature-icon">
          <b-icon :icon="feature.value.icon" />
        </div>
        <div class="feature-content">
          <h4 class="feature-name is-4">{{ feature.value.title }}</h4>
          <div class="content">
            <p>{{ feature.value.description }}</p>
          </div>
        </div>
        <div
          v-if="feature.value.cta && feature.value.page"
          class="action-container"
        >
          <d-button
            color="light"
            class="is-outlined"
            :url="'/' + feature.value.page.name_slug + '/'"
            :label="feature.value.cta || 'Learn More'"
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
.feature-menu {
  .feature-menu-heading {
    font-size: $size-3;
    margin-bottom: $size-3;
  }

  .feature-menu-heading,
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
