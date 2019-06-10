export const state = () => ({
  notifications: [],
  pages: []
})

export const mutations = {
  setPages: (state, pages) => {
    state.pages = pages
  },
  setNotifications: (state, notifications) => {
    state.notifications = notifications
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    // get notifications
    const notifications = await this.$axios
      .$get(`items/notifications?fields=*.*,actions.*.*`)
      .then(res => res.data)
    commit('setNotifications', notifications)

    // get pages
    const pages = await this.$axios.$get('items/pages').then(res => res.data)
    commit('setPages', pages)
  }
}
