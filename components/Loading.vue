<template>
  <b-loading is-full-page :active.sync="loading" :can-cancel="false">
    <div class="loading">
      <div class="spinner" />
      <Logo crown-only />
    </div>
  </b-loading>
</template>

<script>
import { Loading as BLoading } from 'buefy/dist/components/loading'
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo,
    BLoading
  },
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
}

.spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 10px solid $primary;
  border-radius: 100%;
  border-bottom-color: transparent;
  animation: 450ms spin linear infinite;
}
</style>
