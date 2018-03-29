import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  mobileNavOpen: false,
  offeringsList: [],
  hoveredOffering: null
}
const mutations = {
  openMobile (state) {
    state.mobileNavOpen = true
  },
  closeMobile (state) {
    state.mobileNavOpen = false
  },
  hoverOffering (state, offering, color) {
    state.hoveredOffering = offering.data
    state.hoveredOffering = color
    console.log(state.hoveredOffering)
  },
  addOffering (state, offering, color) {
    state.hoveredOffering = offering.data
    state.hoveredOffering = color
    console.log(state.hoveredOffering)
  },
  unhoverOffering () {
    state.hoveredOffering = null
  }
}
export default new Vuex.Store({
  state, mutations
})
