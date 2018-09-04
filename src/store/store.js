import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { search, getDropdownData } from '../networking/database'

Vue.config.devtools = true

Vue.use(Vuex)
const state = {
  // Calendar
  calendars: [
    {
      name: 'My Calendar',
      offerings: [[]],
      history: 0
    }
  ],
  currentCalendar: 0,
  classBlocks: [],
  hoveredOffering: {
    classBlocks: []
  },
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
    return Object.values(state.searchObject).every(function (value) {
      return (value == null || value === false)
    })
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
  setCalendarsState (state, calendars) {
    state.calendars = calendars
  },
  deleteCalendar (state, index) {
    console.log('Store: deleting calendar at index ', index)
    if (index === state.calendars.length - 1) --state.currentCalendar
    state.calendars.splice(index, 1)
  },
  editCalendarName (state, data) {
    state.calendars[data.index].name = data.name
  },
  addCalendar (state) {
    console.log('Store: adding calendar')
    state.calendars.push({
      name: '',
      offerings: [[]],
      history: 0
    })
    state.currentCalendar = state.calendars.length - 1
  },
  selectCalendar (state, index) {
    console.log('Store: selecting calendar')
    state.currentCalendar = index
  },
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
  hoverOffering (state, data) {
    state.hoveredOffering = mutations.makeBlocks(data)
  },
  addOrRemoveOffering (state, data) {
    const currentCalendar = state.calendars[state.currentCalendar]
    const offeringsLength = currentCalendar.offerings.length
    const calendarHistory = currentCalendar.history

    // if within edit history, delete all future edits and start new history chain
    if (calendarHistory < offeringsLength - 1) {
      currentCalendar.offerings.splice(calendarHistory + 1, offeringsLength - calendarHistory)
    }

    // see if this id exists and can be removed, otherwise add it
    let newCalendarState = currentCalendar.offerings[calendarHistory].filter(offering => offering.id !== data.offering.id)
    if (newCalendarState.length === currentCalendar.offerings[calendarHistory].length) {
      newCalendarState = currentCalendar.offerings[calendarHistory].concat(mutations.makeBlocks(data))
    }

    state.calendars[state.currentCalendar].offerings.push(newCalendarState)
    ++state.calendars[state.currentCalendar].history
    localStorage.setItem(state.schoolID, JSON.stringify(state.calendars))
  },
  makeBlocks (data) {
    var blocks = []
    var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    data.offering.classTimes.forEach((classTime) => {
      days.forEach((day) => {
        if (classTime[day]) {
          var newBlock = {}
          newBlock.color = data.color
          newBlock.departmentAcronym = data.course.departmentAcronym
          newBlock.departmentNumber = data.course.departmentNumber
          newBlock.name = data.course.name
          newBlock.day = day
          newBlock.crn = data.offering.id
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
      })
    })
    data.offering['classBlocks'] = blocks
    return data.offering
  },
  unhoverOffering () {
    state.hoveredOffering = { classBlocks: [] }
  }
}

export const blankState = JSON.stringify(state)

export default new Vuex.Store({
  state, getters, mutations
})
