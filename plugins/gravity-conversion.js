import Vue from 'vue'

Vue.filter('platoToSG', plato => {
  return (
    Math.round((1 + plato / (258.6 - (plato / 258.2) * 227.1)) * 1000) / 1000
  ).toFixed(3)
})

Vue.filter('sgToPlato', sg => {
  return (
    Math.round(
      (-616.868 +
        1111.14 * sg -
        630.272 * Math.pow(sg, 2) +
        135.997 * Math.pow(sg, 3)) *
        10
    ) / 10
  ).toFixed(1)
})
