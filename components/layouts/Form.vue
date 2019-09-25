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
        <b-button native-type="submit" type="is-primary" :loading="loading">
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
      const { fields, url } = this.layout.settings
      const [cockpitForm] = this.layout.settings.form

      const sendCockpitFormData = () => {
        const form = fields.reduce((acc, input) => {
          return Object.assign(acc, {
            [input.value.name]: input.model
          })
        }, {})
        return this.$axios.$post(`forms/submit/${cockpitForm.name}`, { form })
      }

      const sendThirdPartyFormData = url => {
        const payload = new FormData()
        fields.forEach(input => {
          if (Array.isArray(input.model)) {
            input.model.forEach(model => {
              payload.append(`${input.value.name}[]`, model)
            })
          } else if (
            typeof input.model === 'object' &&
            typeof input.model.name !== 'string' // Discount files
          ) {
            Object.entries(input.model).forEach(([key, value]) => {
              payload.append(`${input.value.name}_${key}`, value)
            })
          } else {
            payload.append(input.value.name, input.model)
          }
        })
        return this.$axios.$post(url, payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      Promise.all([
        sendCockpitFormData(),
        ...(url ? [sendThirdPartyFormData(url)] : [])
      ])
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
