export const state = () => ({
  notifications: [],
  pages: [],
  website: {},
  showNavigation: false
})

export const mutations = {
  setPages: (state, pages) => {
    state.pages = pages
  },
  setNotifications: (state, notifications) => {
    state.notifications = notifications
  },
  clearNotification: (state, notification) => {
    state.notifications = state.notifications.filter(n => n !== notification)
  },
  setWebsite: (state, website) => {
    state.website = website
  },
  setNavigationVisibility: (state, visible) => {
    state.showNavigation = visible
  },
  toggleNavigationVisibility: state => {
    state.showNavigation = !state.showNavigation
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    // get website settings
    const { data: website } = await this.$axios.$get(
      `items/website?single=1&fields=*.*,contacts.*.*`
    )
    commit('setWebsite', website)

    // get notifications
    const { data: notifications } = await this.$axios.$get(
      `items/notifications?fields=*.*,actions.*.*`
    )
    commit('setNotifications', notifications)

    // get pages
    const { data: pages } = await this.$axios.$get('items/pages')
    commit('setPages', pages)
  },
  clearNotification({ commit }, notification) {
    commit('clearNotification', notification)
  },
  openNavigation({ commit }) {
    commit('setNavigationVisibility', true)
  },
  closeNavigation({ commit }) {
    commit('setNavigationVisibility', false)
  }
}
