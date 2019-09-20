<template>
  <ul class="downloads">
    <li
      v-for="(attachment, a) of layout.settings.attachments"
      :key="a"
      class="download-attachment"
    >
      <a
        v-if="attachment.value.preview"
        target="_blank"
        rel="noopener"
        :href="baseURL + attachment.value.file.path"
        :aria-label="attachment.value.title"
        :title="attachment.value.title"
      >
        <figure
          :style="{
            margin: '0 auto',
            width: previewWidth + 'px',
            height:
              attachment.value.preview.height *
                (previewWidth / attachment.value.preview.width) +
              'px'
          }"
        >
          <no-ssr>
            <v-lazy-image
              :alt="attachment.value.title"
              :src="attachment.value.preview.path | asset({ w: previewWidth })"
              :style="{ width: '100%', height: '100%' }"
            />
          </no-ssr>
        </figure>
      </a>

      <b-button
        v-else
        tag="a"
        target="_blank"
        rel="noopener"
        type="is-primary"
        :href="baseURL + attachment.value.file.path"
        :aria-label="attachment.value.title"
        icon-left="arrow-to-bottom"
        :icon-right="
          attachment.value.file.mime === 'application/pdf' ? 'file-pdf' : null
        "
      >
        {{ attachment.value.title }}
      </b-button>
    </li>
  </ul>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'DownloadsLayout',
  mixins: [component],
  data() {
    return {
      baseURL: process.env.COCKPIT_ASSETS
    }
  },
  computed: {
    previewWidth() {
      return this.layout.settings.previewWidth || 175
    }
  }
}
</script>

<style lang="scss">
.downloads {
  margin-bottom: $size-3;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .download-attachment {
    margin: $size-7 / 2;
  }
}
</style>
