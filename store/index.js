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
    const website = await app.$axios.$post(`/singletons/get/website`, {
      simple: true,
      populate: 3,
      rspc: 1,
      fields: {
        title: 1,
        canonicalURL: 1,
        searchAction: 1,
        organization: 1,
        homepage: 1,
        twitter: 1,
        mainMenu: 1,
        brand: 1,
        footer: 1,
        footerMenu: 1,
        author: 1,
        map: 1
      }
    })
    commit('setWebsite', website)

    // get main menu
    const menus = await app.$axios.$post(`/collections/get/menus`, {
      simple: true,
      populate: 6, // include subs
      rspc: 1,
      fields: {
        name: 1,
        items: 1,
        path: 1
      },
      filter: {
        $or: [{ _id: website.mainMenu._id }, { _id: website.footerMenu._id }]
      }
    })
    commit('setMenu', {
      main: menus.find(m => m._id === website.mainMenu._id),
      footer: menus.find(m => m._id === website.footerMenu._id)
    })

    // get notifications
    const notifications = await app.$axios.$post(
      `/collections/get/notifications`,
      {
        fields: {
          name: 1,
          message: 1,
          action: 1
        },
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
