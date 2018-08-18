import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  // Calendar
  classBlocks: [],
  hoveredOfferingBlocks: [],
  blockId: 0,

  // Search
  // need to replace this with search object
  searchTerm: '',
  results: [],
  scrollPosition: 0,
  courseData: {},

  // Everyone
  mobileNavOpen: false,
  selectedOfferings: [],
  schoolName: 'Test School'
}
const mutations = {
  updateCourseData (state, courseData) {
    state.courseData[courseData.school] = courseData.data
    localStorage.setItem('courseData', JSON.stringify(state.courseData))
  },
  setSchool (state, school) {
    state.schoolName = school
  },
  setScrollPosition (state, position) {
    state.scrollPosition = position
  },
  updateSearchTerm (state, term) {
    state.searchTerm = term
  },
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
    mutations.updateLocalStorage(state)
  },
  updateLocalStorage (state) {
    var offerings = []
    for (var i = 0; i < state.selectedOfferings.length; ++i) {
      var offering = {}
      offering.id = state.selectedOfferings[i].id
      offering.color = state.selectedOfferings[i].color
      offerings.push(offering)
    }
    localStorage.setItem('savedOfferings', JSON.stringify(offerings))
  },
  addOffering (state, offering) {
    state.selectedOfferings.push(offering)
    state.classBlocks = state.classBlocks.concat(mutations.makeNewBlocks(offering))
    mutations.updateLocalStorage(state)
  },
  addSavedOffering (state, offering) {
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

          newBlock.startTime = classTime.startTime
          newBlock.endTime = classTime.endTime
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
