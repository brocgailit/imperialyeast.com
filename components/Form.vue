<template>
  <form class="dynamic-form" @submit.prevent="handleSubmit">
    <fieldset :disabled="loading">
      <div class="fields">
        <div
          v-for="field of form.fields"
          :key="field.id"
          :style="{ width: field.width + '%' }"
          class="input-container"
        >
          <form-input
            v-model="field.value"
            :label="field.label"
            :type="field.type"
            :placeholder="field.placeholder_options"
            :icon="field.icon"
            :required="field.required"
          />
        </div>
      </div>
    </fieldset>

    <div v-if="errors.length" class="error-container">
      <p v-for="(error, i) of errors" :key="i">
        {{ error }}
      </p>
    </div>

    <div class="form-actions">
      <b-button
        tag="input"
        native-type="submit"
        :value="form.submit_label || 'Submit'"
        type="is-primary"
      />
    </div>

    <b-modal :active.sync="showConfirmation">
      <div class="confirmation-message" v-html="form.confirmation_message" />
    </b-modal>
  </form>
</template>

<script>
import { Modal as BModal } from 'buefy/dist/components/modal'
import { Button as BButton } from 'buefy/dist/components/button'
import FormInput from '~/components/FormInput.vue'

export default {
  components: {
    FormInput,
    BModal,
    BButton
  },
  props: {
    form: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      errors: [],
      errorTimeout: null,
      showConfirmation: false,
      loading: false
    }
  },
  methods: {
    handleSubmit() {
      this.loading = true
      const payload = this.form.fields.reduce((acc, input) => {
        return Object.assign(acc, {
          [input.identifier]: input.value
        })
      }, {})
      this.$axios
        .$post(this.form.data_url, payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(res => {
          this.loading = false
          this.showConfirmation = true
          setTimeout(() => {
            this.showConfirmation = false
          }, 7000)
        })
        .catch(e => {
          this.loading = false
          this.addErrorMessage(JSON.stringify(e))
        })
    },
    addErrorMessage(message) {
      clearTimeout(this.errorTimeout)
      this.errors = this.errors.filter(e => e !== message)
      this.errors.push(message)
      this.errorTimeout = setTimeout(() => {
        this.errors = []
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamic-form {
  margin: 0 -8px;
}
.input-container {
  // float: left;
  padding: 4px 8px;
  @include mobile {
    width: 100% !important;
  }
  &:after {
    content: '';
    clear: both;
    display: table;
  }
}

.fields {
  display: flex;
  flex-wrap: wrap;
}
.form-actions,
.error-container {
  padding: 8px;
}

.error-container {
  text-align: center;
  color: $danger;
  font-size: $size-7;
}

.confirmation-message ::v-deep {
  text-align: center;
  color: $white;
  h2 {
    font-size: $size-1;
    font-family: $family-heading;
  }
  h3 {
    font-size: $size-4;
    font-family: $family-primary;
    font-weight: $weight-bold;
    opacity: 0.85;
  }
  p {
    font-size: $size-5;
    margin-top: $size-7;
  }
}
</style>
