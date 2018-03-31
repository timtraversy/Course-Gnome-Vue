import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  blockId: 0,
  mobileNavOpen: false,
  results: [],
  searchTerm: '',
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
  updateResults (state, results) {
    state.results = results
  },
  hoverOffering (state, offering) {
    state.hoveredOfferingBlocks = mutations.makeNewBlocks(offering)
  },
  removeOffering (state, crn) {
    for (var i = 0; i < state.selectedOfferings.length; ++i) {
      if (state.selectedOfferings[i].id === crn) {
        state.selectedOfferings.splice(i, 1)
        i--
      }
    }
    for (i = 0; i < state.classBlocks.length; ++i) {
      if (state.classBlocks[i].crn === crn) {
        state.classBlocks.splice(i, 1)
        i--
      }
    }
  },
  addOffering (state, offering) {
    state.selectedOfferings.push(offering)
    state.classBlocks = state.classBlocks.concat(mutations.makeNewBlocks(offering))
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

          newBlock.id = state.blockId
          ++state.blockId

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
