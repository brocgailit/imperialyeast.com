<template>
  <nav
    :id="layout.settings.id"
    class="container menu-layout"
    :class="[
      layout.settings.class,
      'is-' + (layout.settings.direction || 'vertical')
    ]"
  >
    <h4 v-if="layout.settings.title" class="menu-title">
      {{ layout.settings.title }}
    </h4>
    <ul v-if="layout.settings.menu && layout.settings.menu.items" class="menu">
      <li
        v-for="(item, i) of layout.settings.menu.items"
        :key="item.value.page._id + i"
        class="menu-item"
      >
        <nuxt-link
          v-if="layout.settings.showTop"
          class="menu-item-link"
          active-class="is-active"
          :to="'/' + item.value.page.name_slug + '/'"
        >
          {{ item.value.title }}
        </nuxt-link>
        <ul
          v-if="item.value.submenus && item.value.submenus.length"
          class="menu-sub"
        >
          <li
            v-for="(sub, s) of item.value.submenus"
            :key="sub.value.page._id + s"
            class="menu-sub-item"
          >
            <nuxt-link
              class="menu-sub-item-link"
              :to="
                '/' +
                  item.value.page.name_slug +
                  '/' +
                  sub.value.page.name_slug +
                  '/'
              "
            >
              {{ sub.value.title }}
            </nuxt-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'MenuLayout',
  mixins: [component]
}
</script>

<style lang="scss">
.menu-layout {
  text-align: center;
  text-transform: uppercase;

  .menu-title {
    letter-spacing: 0.05em;
  }

  .menu-item {
    font-family: $family-heading;
    .menu-item-link {
      color: $black;
      font-size: $size-4;
    }
  }
  .menu-sub-item {
    .menu-sub-item-link {
      font-size: $size-5;
    }
  }

  &.is-horizontal {
    .menu-sub {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .menu-sub-item {
        margin: 0 4px;
        &:not(:last-child):after {
          content: '•';
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
