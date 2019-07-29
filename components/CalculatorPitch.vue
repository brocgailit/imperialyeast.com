<template>
  <div class="panel">
    <div class="panel-heading">
      <h3>Yeast Pitch calculator</h3>
      <b-field>
        <b-switch
          v-model="mode"
          size="is-small"
          true-value="commercial"
          false-value="home"
        >
          Commercial
        </b-switch>
      </b-field>
    </div>
    <div class="panel-tabs">
      <a
        :class="{ 'is-active': type === 'size' }"
        role="button"
        @click="type = 'size'"
        >Pitch Size</a
      >
      <a
        :class="{ 'is-active': type === 'rate' }"
        role="button"
        @click="type = 'rate'"
        >Pitch Rate</a
      >
    </div>
    <div class="panel-block">
      <form @submit.prevent>
        <b-field
          label="Batch Size"
          data-unit
          :style="{ '--unit': '\'' + units[mode].batchSize + '\'' }"
          horizontal
        >
          <b-input
            v-model="values.batchSize"
            type="number"
            :step="0.1"
            :min="0"
            expanded
          />
        </b-field>
        <b-field
          :label="mode === 'commercial' ? '° Plato' : 'Specific Gravity'"
          data-unit
          :style="{ '--unit': '\'' + units[mode].gravity + '\'' }"
          horizontal
        >
          <b-input
            v-model="values.gravity"
            type="number"
            :step="mode === 'commercial' ? 1 : 0.001"
            :min="0"
            expanded
          />
        </b-field>
        <b-field
          v-if="type === 'size'"
          label="Target Pitch Rate"
          data-unit
          :style="{ '--unit': '\'' + units[mode].pitchRate + '\'' }"
          horizontal
        >
          <b-input
            v-model="pitchRate"
            type="number"
            :step="0.1"
            :min="0"
            expanded
          />
        </b-field>
        <b-field
          v-else
          label="Target Pitch Size"
          data-unit
          :style="{ '--unit': '\'' + units[mode].pitchSize + '\'' }"
          horizontal
        >
          <b-input
            v-model="pitchSize"
            type="number"
            :step="0.1"
            :min="0"
            expanded
          />
        </b-field>

        <b-field
          v-if="type === 'size'"
          label="Pitch Size"
          horizontal
          class="calculation-result"
        >
          <p class="control is-expanded">
            <span class="result">{{ pitchSize }}</span>
            {{ units[mode].pitchSize }}
          </p>
        </b-field>
        <b-field
          v-else
          label="Pitch Rate"
          horizontal
          class="calculation-result"
        >
          <p class="control is-expanded">
            <span class="result">{{ pitchRate }}</span>
            {{ units[mode].pitchRate }}
          </p>
        </b-field>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mode: 'home',
      type: 'size',
      values: {
        batchSize: 5,
        gravity: 1.06,
        pitchRate: 12,
        pitchSize: 17.1
      },
      units: {
        home: {
          batchSize: 'gallons',
          gravity: 'SG',
          pitchRate: 'million cells per mL/P',
          pitchSize: 'Pitch Right Pouches'
        },
        commercial: {
          batchSize: 'bbls',
          gravity: '°P',
          pitchRate: 'million cells per mL/P',
          pitchSize: 'Imperial Yeast Liters'
        }
      }
    }
  },
  computed: {
    pitchRate: {
      get() {
        if (this.type !== 'rate') return this.values.pitchRate
        if (this.mode === 'commercial') {
          return (
            Math.round(
              (10 * this.values.pitchSize) /
                (this.values.batchSize * (this.values.gravity / 11))
            ) / 10
          )
        }
        return (
          Math.round(
            (10 * this.values.pitchSize) /
              ((this.values.batchSize / 5) *
                (this.$options.filters.sgToPlato(this.values.gravity) / 10.5))
          ) / 10
        )
      },
      set(rate) {
        this.values.pitchRate = rate
      }
    },
    pitchSize: {
      get() {
        if (this.type !== 'size') return this.values.pitchSize
        if (this.mode === 'commercial') {
          return (
            Math.round(
              10 *
                this.values.batchSize *
                (this.values.gravity / 11) *
                this.values.pitchRate
            ) / 10
          )
        }
        return (
          Math.round(
            (10 *
              (this.values.batchSize *
                this.$options.filters.sgToPlato(this.values.gravity) *
                this.values.pitchRate)) /
              (5 * 10.5)
          ) / 10
        )
      },
      set(size) {
        this.values.pitchSize = size
      }
    }
  },
  watch: {
    pitchSize(size) {
      this.values.pitchSize = size
    },
    pitchRate(rate) {
      this.values.pitchRate = rate
    },
    mode(m) {
      if (m === 'commercial') {
        this.values.gravity = this.$options.filters.sgToPlato(
          this.values.gravity
        )
        this.values.batchSize =
          Math.ceil((10 * this.values.batchSize) / 31) / 10
      } else {
        this.values.gravity = this.$options.filters.platoToSG(
          this.values.gravity
        )
        this.values.batchSize = Math.ceil(10 * this.values.batchSize * 31) / 10
      }
    }
  }
}
</script>

<style lang="scss">
@import '~buefy/src/scss/components/switch';
.panel {
  .panel-heading,
  .panel-tabs a {
    text-transform: uppercase;
  }
  .panel-heading {
    display: flex;
    justify-content: space-between;
    h3 {
      font-weight: $weight-black;
      letter-spacing: 0.05em;
    }
  }
  .panel-tabs {
    a {
      font-weight: $weight-bold;
    }
  }
  .panel-block {
    justify-content: center;
    input[type='number'],
    .control {
      width: 100%;
      max-width: 250px;
    }

    @include tablet {
      .field-label {
        flex-grow: 2 !important;
      }
    }
  }

  .calculation-result {
    border-top: 1px solid rgba($grey, 0.5);
    padding-top: $size-7;
    .control {
      font-size: $size-7;
    }
    .result {
      font-size: $size-6;
      font-weight: $weight-bold;
    }
  }

  .field[data-unit] {
    // p is used for buttons here so target div
    div.control {
      position: relative;
      display: inline-block;
      &:before {
        display: block;
        content: var(--unit);
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        max-width: 150px;
        z-index: 1;
        font-size: $size-8;
        padding-right: $size-8;
      }
    }
  }
}
</style>
