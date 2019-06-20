<template>
  <b-field :label="label">
    <div v-if="type === 'checkbox'" class="block">
      <b-checkbox
        v-for="(option, o) in placeholder"
        :key="o"
        v-model="model"
        :native-value="option"
      >
        {{ option }}
      </b-checkbox>
    </div>
    <b-select
      v-else-if="type === 'select'"
      v-model="model"
      placeholder="Select an option"
      :icon="icon"
      icon-pack="fal"
    >
      <option v-for="(option, o) in placeholder" :key="o">
        {{ option }}
      </option>
    </b-select>
    <b-input
      v-else
      v-model="model"
      :required="required"
      :type="type"
      :icon="icon"
      icon-pack="fal"
    />
  </b-field>
</template>

<script>
import { Checkbox as BCheckbox } from 'buefy/dist/components/checkbox'
import { Select as BSelect } from 'buefy/dist/components/select'
import { Field as BField } from 'buefy/dist/components/field'
import { Input as BInput } from 'buefy/dist/components/input'
export default {
  components: {
    BCheckbox,
    BSelect,
    BField,
    BInput
  },
  props: {
    value: {
      type: [String, Number, Array],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: [String, Array],
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    model: {
      get() {
        return this.value || (this.type === 'checkbox' ? [] : '')
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
