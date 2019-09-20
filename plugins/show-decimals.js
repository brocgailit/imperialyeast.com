import Vue from 'vue'

Vue.directive('show-decimals', {
  bind(el, binding) {
    const input = el.querySelector('input')
    input._handleBlur = event => {
      event.target.value = (+event.target.value).toFixed(event.target._decimals)
    }
    input._decimals = binding.value
    input.addEventListener('blur', input._handleBlur, true)
  },
  update(el, binding) {
    const input = el.querySelector('input')
    input._decimals = binding.value
    input.removeEventListener('blur', input._handleBlur, true)
    input.addEventListener('blur', input._handleBlur, true)
  },
  unbind(el) {
    const input = el.querySelector('input')
    input.removeEventListener('blur', input._handleBlur, true)
  }
})
