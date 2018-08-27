import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)
const state = {
  // Calendar
  classBlocks: [],
  hoveredOfferingBlocks: [],
  blockId: 0,

  // Search
  searchObject: {},
  schoool: '',
  schoolName: '',
  courseData: [],
  searchResults: [],

  // Dropdown
  instructorDropdownData: [],
  departmentDropdownData: [],
  globalDropdown: [],
  totalResultCount: 0,

  // Everyone
  mobileNavOpen: false,
  selectedOfferings: []
}
const mutations = {
  setDropdownData (state, data) {
    state.instructorDropdownData = data['inst']
    state.departmentDropdownData = data['dept']
    state.globalDropdown = data['global']
  },
  updateTotalResultCount (state, count) {
    state.totalResultCount = count
  },
  updateCourseData (state, courses) {
    state.courseData = courses
  },
  setSchool (state, school) {
    state.school = school
    if (school === 'gwu') {
      state.schoolName = 'George Washington University'
    } else if (school === 'emerson') {
      state.schoolName = 'Emerson College'
    }
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
          newBlock.startHour = moment(classTime.startTime).hours()
          newBlock.startMinuteOffset = moment(classTime.startTime).minutes()
          var startTime = newBlock.startHour * 60 + newBlock.startMinuteOffset
          var endTime = moment(classTime.endTime).hours() * 60 + moment(classTime.endTime).minutes()
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
