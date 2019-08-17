export const state = () => ({
  notifications: [],
  pages: [],
  menu: {},
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
  },
  setMenu: (state, menu) => {
    Object.assign(state.menu, menu)
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    // get website settings
    const website = await this.$axios.$get(`/singletons/get/website`, {
      params: {
        simple: true,
        populate: 3
      }
    })
    commit('setWebsite', website)

    // get main menu
    const menus = await this.$axios.$get(`/collections/get/menus`, {
      params: {
        simple: true,
        populate: 6, // include subs
        'filter[$or][0][_id]': website.mainMenu._id,
        'filter[$or][1][_id]': website.footerMenu._id
      }
    })
    commit('setMenu', {
      main: menus.find(m => m._id === website.mainMenu._id),
      footer: menus.find(m => m._id === website.footerMenu._id)
    })

    // get notifications
    /* const { data: notifications } = await this.$axios.$get(
      `items/notifications?fields=*.*,actions.*.*`
    )
    commit('setNotifications', notifications) */

    // get pages
    /* const { data: pages } = await this.$axios.$get('items/pages')
    commit('setPages', pages) */
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
