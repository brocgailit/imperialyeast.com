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
    />
  </b-field>
</template>

<script>
export default {
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
