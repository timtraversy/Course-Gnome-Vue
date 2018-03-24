import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  mobileNavOpen: false
}
const mutations = {
  openMobile (state) {
    state.mobileNavOpen = true
  },
  closeMobile (state) {
    state.mobileNavOpen = false
  }
}
export default new Vuex.Store({
  state, mutations
})
