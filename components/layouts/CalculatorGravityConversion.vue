<template>
  <div class="panel">
    <div class="panel-heading">
      <h3>{{ layout.settings.title }}</h3>
    </div>
    <div class="panel-block">
      <form @submit.prevent>
        <b-field
          label="Plato"
          data-unit
          :style="{ '--unit': '\'°P\'' }"
          horizontal
        >
          <b-input
            v-model="plato"
            type="number"
            :step="0.1"
            :min="0"
            :max="30"
            expanded
          />
        </b-field>
        <b-field
          label="Specific Gravity"
          data-unit
          :style="{ '--unit': '\'SG\'' }"
          horizontal
        >
          <b-input
            v-model="specificGravity"
            type="number"
            :step="0.001"
            :min="0"
            :max="1.129"
            expanded
          />
        </b-field>
      </form>
    </div>
  </div>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'CalculatorGravityConversion',
  mixins: [component],
  data() {
    return {
      values: {
        plato: 15,
        specificGravity: 1.061
      }
    }
  },
  computed: {
    plato: {
      get() {
        return this.values.plato
      },
      set(p) {
        this.values.plato = p
        this.values.specificGravity = this.$options.filters.platoToSG(p)
      }
    },
    specificGravity: {
      get() {
        return this.values.specificGravity
      },
      set(sg) {
        this.values.specificGravity = sg
        this.values.plato = this.$options.filters.sgToPlato(sg)
      }
    }
  },
  created() {
    this.plato = this.layout.settings.default
  }
}
</script>

<style lang="scss">
.panel {
  .panel-heading {
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    h3 {
      font-weight: $weight-black;
      letter-spacing: 0.05em;
    }
  }
  .panel-block {
    @include tablet {
      .field-label {
        flex-grow: 3 !important;
      }
    }
  }

  .field[data-unit] {
    // p is used for buttons here so target div
    div.control {
      position: relative;
      display: inline-block;
      input {
        background-color: transparent;
      }
      input:focus {
        background-color: rgba($white, 0.85) !important;
      }
      &:before {
        display: block;
        content: var(--unit);
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        max-width: 150px;
        z-index: -1;
        font-size: $size-8;
        padding-right: $size-7;
      }
    }
  }
}
</style>
