export const state = () => ({
  notifications: [],
  pages: [],
  website: {}
})

export const mutations = {
  setPages: (state, pages) => {
    state.pages = pages
  },
  setNotifications: (state, notifications) => {
    state.notifications = notifications
  },
  setWebsite: (state, website) => {
    state.website = website
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
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
  }
}
