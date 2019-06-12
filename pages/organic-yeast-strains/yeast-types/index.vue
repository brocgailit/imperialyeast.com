<template>
  <div class="strain-types-select">
    <h1>Select a Yeast Strain Type:</h1>
    <nav class="container">
      <ul class="strain-types">
        <li
          v-for="type of types"
          :key="type.id"
          class="strain-type"
          :style="{ 'background-color': type.packaging_color }"
          @click="
            $router.push('/organic-yeast-strains/yeast-types/' + type.slug)
          "
        >
          <h2>
            <nuxt-link :to="'/organic-yeast-strains/yeast-types/' + type.slug">
              {{ type.name }}
            </nuxt-link>
          </h2>
          <p>
            {{ type.short_description }}
          </p>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const types = await $axios
      .$get(`items/strain_types?filter[status]=published&fields=*.*`)
      .then(res => res.data)
    return { types }
  }
}
</script>

<style lang="scss">
.strain-types-select {
  h1 {
    margin: $size-5 0;
    font-size: $size-2;
    font-family: $family-heading;
    text-align: center;
  }
  .strain-types {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    .strain-type {
      cursor: pointer;
      flex: 1 0 calc(50% - #{$size-7 * 2});
      margin: $size-7;
      padding: $size-3 $size-5;
      color: $white;
      transition: transform 150ms ease-in-out;
      h2 {
        font-size: $size-2;
        font-weight: $weight-black;
        a {
          color: $white;
        }
      }

      &:hover {
        transform: translateY(-5px);
      }
    }
  }
}
</style>
