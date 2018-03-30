import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  mobileNavOpen: false,
  selectedOfferings: [],
  classBlocks: [],
  hoveredOfferingBlocks: []
}
const mutations = {
  openMobile (state) {
    state.mobileNavOpen = true
  },
  closeMobile (state) {
    state.mobileNavOpen = false
  },
  hoverOffering (state, offering) {
    state.hoveredOfferingBlocks = mutations.makeNewBlocks(offering)
  },
  addOffering (state, offering) {
    state.selectedOfferings.push(offering)
    state.classBlocks = state.classBlocks.concat(mutations.makeNewBlocks(offering))
    console.log(state.classBlocks)
  },
  makeNewBlocks (offering) {
    var blocks = []
    var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    for (var i = 0; i < offering.data.classTimes.length; ++i) {
      var classTime = offering.data.classTimes[i]
      for (var j = 0; j < days.length; ++j) {
        if (classTime[days[j]]) {
          var newBlock = {}
          newBlock.color = offering.color
          newBlock.departmentAcronym = offering.data.departmentAcronym
          newBlock.departmentNumber = offering.data.departmentNumber
          newBlock.name = offering.data.name
          newBlock.day = days[j]
          newBlock.crn = offering.id

          newBlock.startHour = classTime.startTime.getHours()
          newBlock.startMinuteOffset = classTime.startTime.getMinutes()
          var startTime = newBlock.startHour * 60 + newBlock.startMinuteOffset
          var endTime = classTime.endTime.getHours() * 60 + classTime.endTime.getMinutes()
          newBlock.length = endTime - startTime
          blocks.push(newBlock)
        }
      }
    }
    return blocks
  },
  unhoverOffering () {
    state.hoveredOfferingBlocks = []
  }
}
export default new Vuex.Store({
  state, mutations
})
