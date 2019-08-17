<template>
  <div
    :id="layout.settings.id"
    class="container"
    :class="layout.settings.class"
    :style="layout.settings.style"
  >
    <header class="custom-form-header">
      <h3 v-if="layout.settings.title" class="title">
        {{ layout.settings.title }}
      </h3>
      <div
        v-if="layout.settings.instructions"
        class="content"
        v-html="layout.settings.instructions"
      />
    </header>
    <form class="custom-form container" @submit.prevent="submit">
      <fieldset :disabled="loading">
        <div class="form-fields">
          <form-input
            v-for="input of layout.settings.fields"
            :key="input.value.name"
            v-model="input.model"
            :type="input.field.name"
            :field="input.value"
          />
        </div>
      </fieldset>
      <div class="form-actions">
        <b-button native-type="submit" type="is-success" :loading="loading">
          {{ layout.settings.submitLabel || 'Submit' }}
        </b-button>
      </div>
      <b-modal :active.sync="showConfirmation">
        <div
          class="confirmation-message content"
          v-html="layout.settings.confirmation"
        />
      </b-modal>
    </form>
  </div>
</template>

<script>
import { component } from '~/assets/script/mixins'
import FormInput from '~/components/FormInput.vue'
export default {
  name: 'FormLayout',
  components: {
    FormInput
  },
  mixins: [component],
  data() {
    return {
      loading: false,
      showConfirmation: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      const form = this.layout.settings.fields.reduce((acc, input) => {
        return Object.assign(acc, {
          [input.value.name]: input.model
        })
      }, {})
      Promise.all(
        this.layout.settings.form.map(f =>
          this.$axios.$post(`forms/submit/${f.name}`, {
            form
          })
        )
      )
        .then(res => {
          this.loading = false
          this.showConfirmation = true
          // Send fake page view
          this.$gtm.pushEvent({
            event: 'nuxtRoute',
            pageType: 'PageView',
            pageUrl: `${this.$route.path}/thank-you`,
            routeName: 'confirmation'
          })
          // this.$fb.track('Contact');
          this.layout.settings.fields.forEach(f => {
            f.model = null
          })
          setTimeout(() => {
            this.showConfirmation = false
          }, 7000)
        })
        .catch(e => {
          this.loading = false
          this.$buefy.toast.open({
            message: 'There was an error submitting your form. ' + e.message,
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
    }
  }
}
</script>

<style lang="scss">
.custom-form {
  margin: 0 -8px;
}

.custom-form-header {
  margin-bottom: $size-4;
}

.form-fields {
  display: flex;
  flex-wrap: wrap;
}
.form-actions {
  padding: 8px;
  margin-top: $size-6;
}

.confirmation-message {
  text-align: center;
  color: $light;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: $white;
  }
}
</style>
