import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  mobileNavOpen: false,
  offeringsList: []
}
const mutations = {
  openMobile (state) {
    state.mobileNavOpen = true
  },
  closeMobile (state) {
    state.mobileNavOpen = false
  },
  loadOfferings (offerings) {
    state.offeringsList = offerings
  }
}
export default new Vuex.Store({
  state, mutations
})
