import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { search, getDropdownData } from '../networking/database'

Vue.config.devtools = true

Vue.use(Vuex)
const state = {
  // Calendar
  classBlocks: [],
  hoveredOfferingBlocks: [],
  blockId: 0,
  schoolID: '',

  // Search
  searchObject: {
    name: null,
    departmentName: null,
    instructor: null,
    startTime: null,
    endTime: null,
    startNumber: null,
    endNumber: null,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    open: false,
    closed: false,
    waitlist: false
  },
  allCourses: [],

  totalResultCount: 0,

  // Everyone
  mobileNavOpen: false,
  selectedOfferings: []
}
const getters = {
  blankSearch: state => {
    var blank = true
    Object.values(state.searchObject).forEach(function (value) {
      if (value !== null && value !== false) blank = false
    })
    return blank
  },
  schoolName: getters => {
    console.log('Recalc: name')
    if (state.schoolID === 'gwu') {
      return 'George Washington University'
    } else if (state.schoolID === 'emerson') {
      return 'Emerson College'
    }
  },
  matchingCourses: (state, getters) => {
    console.log('Recalc: match courses')
    if (state.allCourses.length === 0 || getters.blankSearch) {
      return []
    } else {
      return search(state.searchObject)
    }
  },
  dropdownData: (state, getters) => {
    console.log('Recalc: dropdown')
    if (state.allCourses.length !== 0) {
      return getDropdownData(getters.matchingCourses)
    }
  }
}
const mutations = {
  resetState (state) {
    state = JSON.parse(JSON.stringify(blankState))
  },
  updateSearchObject (state, update) {
    const key = Object.keys(update)[0]
    state.searchObject[key] = update[key]
  },
  setSchoolID (state, id) {
    state.schoolID = id
  },
  updateTotalResultCount (state, count) {
    state.totalResultCount = count
  },
  updateAllCourses (state, courses) {
    state.allCourses = courses
  },
  updateResults (state, results) {
    state.matchingCourses = results
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
    for (var i = 0; i < offering.classTimes.length; ++i) {
      var classTime = offering.classTimes[i]
      for (var j = 0; j < days.length; ++j) {
        if (classTime[days[j]]) {
          var newBlock = {}
          newBlock.color = offering.color
          newBlock.departmentAcronym = offering.departmentAcronym
          newBlock.departmentNumber = offering.departmentNumber
          newBlock.name = offering.name
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

export const blankState = JSON.stringify(state)

export default new Vuex.Store({
  state, getters, mutations
})
