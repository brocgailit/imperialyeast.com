<template>
  <div class="field-container" :style="{ width: field.width + '%' }">
    <b-field :label="field.label" :label-for="field.name" :message="field.help">
      <b-input
        v-if="type === 'text'"
        :id="field.name"
        v-model="model"
        :type="field.type || 'text'"
        :required="field.required"
        :icon="field.icon"
        :placeholder="field.placeholder"
        :maxlength="field.maxlength"
      />

      <b-input
        v-else-if="type === 'textarea'"
        :id="field.name"
        v-model="model"
        :type="type"
        :required="field.required"
        :icon="field.icon"
        :rows="field.rows"
        :placeholder="field.placeholder"
        :maxlength="field.maxlength"
      />

      <b-select
        v-else-if="type === 'select' && !field.multiple"
        :id="field.name"
        v-model="model"
        :placeholder="field.placeholder"
        :required="field.required"
      >
        <option
          v-for="option in field.options"
          :key="option.value.value"
          :value="option.value.value"
        >
          {{ option.value.label }}
        </option>
      </b-select>

      <div v-else-if="type === 'select' && field.multiple">
        <fieldset :id="field.name">
          <b-checkbox
            v-for="option in field.options"
            :key="option.value.value"
            v-model="model"
            :native-value="option.value.value"
          >
            {{ option.value.label }}
          </b-checkbox>
        </fieldset>
      </div>

      <b-checkbox
        v-else-if="type === 'checkbox'"
        :id="field.name"
        v-model="model"
        :true-value="field.true || true"
        :false-value="field.false || false"
        :required="field.required"
      >
        {{ field.placeholder }}
      </b-checkbox>

      <b-numberinput
        v-else-if="type === 'number'"
        :id="field.name"
        v-model="model"
        :step="field.step"
        :max="field.max"
        :min="field.min"
        :required="field.required"
      />

      <b-datepicker
        v-else-if="type === 'date'"
        :id="field.name"
        v-model="model"
        :placeholder="field.placeholder"
        :icon="field.icon"
        :required="field.required"
      />

      <b-clockpicker
        v-else-if="type === 'time'"
        :id="field.name"
        v-model="model"
        :placeholder="field.placeholder"
        :icon="field.icon"
        :required="field.required"
        hour-format="12"
      />
    </b-field>
  </div>
</template>

<script>
// TODO: Finish all form inputs
// TODO: Set up widths
// TODO: select many
import { parse } from 'date-fns'
export default {
  name: 'FormInput',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    field: {
      type: Object,
      default: () => null
    },
    value: {
      type: [String, Number, Array, Boolean],
      default: null
    }
  },
  computed: {
    model: {
      get() {
        if (this.value) {
          if (
            (this.type === 'date' || this.type === 'time') &&
            typeof this.value !== 'object'
          ) {
            const date =
              (this.type === 'time' ? '1981-01-12 ' : '') + this.value
            return parse(date)
          }
          return this.value
        }
        return this.type === 'checkbox' ||
          (this.type === 'select' && this.field.multiple)
          ? []
          : null
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  created() {
    if (this.field.default) this.model = this.field.default
  }
}
</script>

<style lang="scss">
.field-container {
  padding: 4px 8px;
  @include mobile {
    width: 100% !important;
  }
}
</style>
