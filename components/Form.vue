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
          <b-field :label="field.label">
            <b-select
              v-if="field.type === 'select'"
              v-model="field.value"
              placeholder="Select an option"
              :icon="field.icon"
            >
              <option v-for="(option, o) in field.placeholder_options" :key="o">
                {{ option }}
              </option>
            </b-select>
            <b-input
              v-else
              v-model="field.value"
              :required="field.required"
              :type="field.type"
              :icon="field.icon"
            />
          </b-field>
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
export default {
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
