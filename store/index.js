export const state = () => ({
  notifications: [],
  menu: {},
  website: {},
  showNavigation: false
})

export const mutations = {
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
  },
  setMenu: (state, menu) => {
    Object.assign(state.menu, menu)
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    // get website settings
    const website = await this.$axios.$post(`/singletons/get/website`, {
      simple: true,
      populate: 3,
      rspc: 1
    })
    commit('setWebsite', website)

    // get main menu
    const menus = await this.$axios.$post(`/collections/get/menus`, {
      simple: true,
      populate: 6, // include subs
      rspc: 1,
      filter: {
        $or: [{ _id: website.mainMenu._id }, { _id: website.mainMenu._id }]
      }
    })
    commit('setMenu', {
      main: menus.find(m => m._id === website.mainMenu._id),
      footer: menus.find(m => m._id === website.footerMenu._id)
    })

    // get notifications
    const notifications = await this.$axios.$post(
      `/collections/get/notifications`,
      {
        simple: true,
        rspc: 1
      }
    )
    commit('setNotifications', notifications)
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
