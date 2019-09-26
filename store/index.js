const cache = new Map()

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

async function getWebsite(app) {
  const c = cache.get('website')
  if (c) return Promise.resolve(c)
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
      secondaryMenu: 1,
      author: 1,
      map: 1
    }
  })
  cache.set('website', website)
  return website
}

async function getMenus(app) {
  const c = cache.get('menus')
  if (c) return Promise.resolve(c)
  const website = await getWebsite(app)
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
      $or: [
        { _id: website.mainMenu._id },
        { _id: website.footerMenu._id },
        { _id: website.secondaryMenu._id }
      ]
    }
  })
  cache.set('menus', menus)
  return menus
}

async function getNotifications(app) {
  const c = cache.get('notifications')
  if (c) return Promise.resolve(c)
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
  cache.set('notifications', notifications)
  return notifications
}

export const actions = {
  nuxtServerInit({ commit }, { app }) {
    return Promise.all([
      getWebsite(app),
      getMenus(app),
      getNotifications(app)
    ]).then(([website, menus, notifications]) => {
      commit('setWebsite', website)
      commit('setMenu', {
        main: menus.find(m => m._id === website.mainMenu._id),
        footer: menus.find(m => m._id === website.footerMenu._id),
        secondary: menus.find(m => m._id === website.secondaryMenu._id)
      })
      commit('setNotifications', notifications)
    })
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
