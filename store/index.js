export const state = () => ({
  notifications: []
})

export const mutations = {
  setNotifications: (state, notifications) => {
    state.notifications = notifications
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    const notifications = await this.$axios
      .$get(`items/notifications?fields=*.*,actions.*.*`)
      .then(res => res.data)
    commit('setNotifications', notifications)
  }
}
