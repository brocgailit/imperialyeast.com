<template>
  <div class="strain-list">
    <slot />
    <transition-group name="flip-list" tag="ul">
      <li v-for="strain of strains" :key="strain._id" class="strain">
        <strain-card :strain="strain" :show-icons="showIcons" />
      </li>
    </transition-group>
  </div>
</template>

<script>
import StrainCard from '~/components/StrainCard.vue'
export default {
  name: 'StrainList',
  components: {
    StrainCard
  },
  filters: {
    celsius: f => Math.round(((f - 32) * 5) / 9),
    flocculation(val) {
      return [
        'Very Low',
        'Low',
        'Med-Low',
        'Medium',
        'Med-High',
        'High',
        'Very High'
      ][val]
    }
  },
  props: {
    strains: {
      type: Array,
      default: () => []
    },
    showIcons: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '~buefy/src/scss/components/_tooltip';
.strain-list {
  padding: 0 $size-6;
  break-inside: avoid;
  page-break-inside: avoid;
  .strain {
    width: 100%;
    flex: 1 0 100%;
    padding: $size-7;
    transition: all 500ms ease-in-out;
    @include tablet {
      flex: 0 0 50%;
    }
    @include desktop {
      flex: 0 0 33%;
    }
    margin: 0;
  }
  @include desktop {
    ul {
      display: flex;
      flex-wrap: wrap;
    }
  }
  @include mobile {
    padding: 0;
  }
}

.flip-list-move {
  transition: transform 500ms ease-in-out;
}

.flip-list-enter, .flip-list-leave-to
/* .flip-list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.flip-list-leave-active {
  position: absolute;
}
</style>
