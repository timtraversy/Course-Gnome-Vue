<template>
  <div class="search" :class="isSplitscreen">
    <div class = "header">
      <div class = "header-badges">
        <div class = "header-title">
          <h1 v-if = "$mq != 'sm' && $mq != 'xsm'" class = "headerTitle">Search</h1>
          <Autocomplete v-bind:options="{placeholder:'Acrobatics, wizardry...',selected:searchObject.departmentName,list:['hi','bi','gi']}"></Autocomplete>
          <i class="material-icons filter" v-on:click="filtersOpen = !filtersOpen">filter_list</i>
        </div>
        <span v-if="searchObject.name !== ''" class="badge badge-pill badge-light">Name Includes: {{ searchObject.name }}<i class="material-icons small" v-on:click="searchObject.name=''">clear</i></span>
        <span v-if="searchObject.departmentName !== ''" class="badge badge-pill badge-light">Department: {{ searchObject.departmentName }}<i class="material-icons small" v-on:click="searchObject.departmentName=''">clear</i></span>
        <span v-if="searchObject.instructor !== ''" class="badge badge-pill badge-light">Instructor: {{ searchObject.instructor }}<i class="material-icons small" v-on:click="searchObject.instructor=''">clear</i></span>
      </div>
    </div>
    <div class = "filtersContainer" v-if="filtersOpen">
      <Filters v-on:close-filters="filtersOpen = false" v-bind:searchObject="searchObject" v-bind:blankObject="blankSearchObject"></Filters>
    </div>
    <div class = "results" v-scroll="onScroll" v-show = "!filtersOpen" id = "results">
      <div v-if = "waitingForResults" class="loader"></div>
      <div v-if = "searchedOnce && courses.length == 0 && !waitingForResults" class="noResults"><h1>No results!</h1></div>
      <div v-for="(course, courseIndex) in courses.slice(0,coursesShown)" :key="course.id" class = "card" :style = "cardColor(courseIndex)">
        <div class = "cardTop">
          <span style ="margin-left:0px">{{course.data.departmentAcronym}} {{course.data.departmentNumber}}</span><span>{{course.data.credit}} credits</span>
        </div>
        <h2>{{course.data.name}}</h2>
        <span v-if = "course.data.description" class = "description"> {{ course.data.description }} </span>
        <div v-for="(offer) in course.offerings" :key="offer.id" class = "offering"
        v-on:mouseenter="hoverOffering(offer, courseIndex)" v-on:mouseleave="unhoverOffering()"
        v-on:click="addOrRemoveOffering(offer, courseIndex)" :style = "selected(offer.id,courseIndex)">
          <span class = "sectionNumber">{{ offer.data.sectionNumber }}</span>
          <span v-if="offer.data.instructors" class = "instructor"> {{formatInstructor(offer.data.instructors)}} </span>
          <span v-else class = "instructor">Instructors TBA</span>
          <div class = "meetsBox">
            <div v-if = "classTime.startTime" v-for="classTime in offer.data.classTimes" :key="classTime.id" class = "days">
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.monday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.tuesday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.wednesday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.thursday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.friday == false}"></div>
              <span v-if = "$mq != 'xsm'" class = "time">{{ formatTime(classTime.startTime) }} - {{ formatTime(classTime.endTime) }}</span>
            </div>
            <div v-else>
              Times TBA
            </div>
            <div v-if = "offer.data.classTimes.length === 0">
              Times TBA
            </div>
          </div>
          <span class = "crn">{{ offer.id }}</span>
          <!-- <button v-on:click.stop="print()" type="button" class="btn btn-default btn-circle"><i class="material-icons offeringArrow">keyboard_arrow_down</i></button> -->
          <span v-on:click = "print()" v-on:click.stop :style = "{color: getColor(courseIndex)}" class="badge badge-pill badge-primary"><i class="material-icons offeringArrow">keyboard_arrow_down</i></span>
        </div>
      </div>
      <div class = "loadMoreDiv" v-if="courses.length > 0">
        <button v-if = "courses.length > coursesShown" v-on:click = "increaseCoursesShown" type="button" class="btn btn-primary">Load More</button>
      </div>
    </div>
  </div>
</template>

<script>

import { flatui } from '../main'
import moment from 'moment'
import { departments } from '../lists/departments'
import ClickOutside from 'vue-click-outside'
import { search } from '../networking/database.js'
import Filters from '../components/Filters'
import Autocomplete from '../components/Autocomplete'
import { debounce } from 'debounce'

export default {
  name: 'Search',
  components: {
    Filters, Autocomplete
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      minNumber: 1000,
      maxNumber: 10000,
      coursesShown: 30,
      departments: departments,
      autocompleteResultsShown: false,
      waitingForResults: false,
      searchedOnce: false,
      previousSearchObject: {
        name: '',
        departmentAcronym: '',
        departmentName: '',
        instructor: '',
        time: ['8:00 AM', '10:00 PM'],
        number: [1000, 10000],
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
      blankSearchObject: {
        name: '',
        departmentAcronym: '',
        departmentName: '',
        instructor: '',
        time: ['8:00 AM', '10:00 PM'],
        number: [1000, 10000],
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
      searchObject: {
        name: '',
        departmentAcronym: '',
        departmentName: '',
        instructor: '',
        time: ['8:00 AM', '10:00 PM'],
        number: [1000, 10000],
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
      filtersOpen: true
    }
  },
  watch: {
    searchObject: {
      handler: debounce(function () {
        // console.log(JSON.stringify(this.searchObject))
        // console.log(JSON.stringify(this.blankSearchObject))
        if (JSON.stringify(this.searchObject) === JSON.stringify(this.blankSearchObject)) {
          this.$store.commit('updateResults', [])
          this.$store.commit('updateTotalResultCount', 0)
        } else if (JSON.stringify(this.searchObject) !== JSON.stringify(this.previousSearchObject)) {
          this.previousSearchObject = JSON.parse(JSON.stringify(this.searchObject))
          search(this.searchObject, this.$route.params.school, this.$store)
        }
      }, 200),
      deep: true
    }
  },
  mounted () {
    document.getElementById('results').scrollTop = this.$store.state.scrollPosition
    console.log(this.$store.state.scrollPosition)
    if (this.$route.params.school === 'emerson') {
      this.searchObject.number = [100, 1000]
      this.previousSearchObject.number = [100, 1000]
      this.blankSearchObject.number = [100, 1000]
    }
  },
  methods: {
    edit: function (text) {
      console.log(text)
    },
    print: function () {
      console.log('hi')
    },
    onScroll: function (e, position) {
      this.$store.commit('setScrollPosition', position.scrollTop)
    },
    convertHex: function (hex, opacity) {
      hex = hex.replace('#', '')
      var r = parseInt(hex.substring(0, 2), 16)
      var g = parseInt(hex.substring(2, 4), 16)
      var b = parseInt(hex.substring(4, 6), 16)
      var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')'
      return result
    },
    selected: function (crn, index) {
      for (var i = 0; i < this.$store.state.selectedOfferings.length; ++i) {
        if (this.$store.state.selectedOfferings[i].id === crn) {
          return { backgroundColor: '' + this.convertHex(this.getColor(index), 0.1) }
        }
      }
    },
    clipDescription: function (description) {
      if (description.length > 130) {
        return description.substr(0, 140) + '... See more'
      } else {
        return description
      }
    },
    getColor: function (index) {
      if (index % 9 === 0) { return flatui.red }
      if (index % 9 === 1) { return flatui.orange }
      if (index % 9 === 2) { return flatui.gold }
      if (index % 9 === 3) { return flatui.green }
      if (index % 9 === 4) { return flatui.turquoise }
      if (index % 9 === 5) { return flatui.lightblue }
      if (index % 9 === 6) { return flatui.darkblue }
      if (index % 9 === 7) { return flatui.purple }
      if (index % 9 === 8) { return flatui.gray }
    },
    cardColor: function (index) {
      var color = this.getColor(index)
      return { color: color, borderLeft: '7px solid ' + color }
    },
    boxColor: function (index) {
      var color = this.getColor(index)
      return { backgroundColor: color, border: '1px solid' + color }
    },
    formatTime: function (value) {
      return moment(String(value)).format('h:mm')
    },
    hoverOffering: function (offering, index) {
      var newOffering = offering
      newOffering.color = this.getColor(index)
      this.$store.commit('hoverOffering', newOffering)
    },
    addOrRemoveOffering: function (offering, index) {
      for (var i = 0; i < this.$store.state.selectedOfferings.length; ++i) {
        if (this.$store.state.selectedOfferings[i].id === offering.id) {
          this.$store.commit('removeOffering', offering.id)
          return
        }
      }
      var newOffering = offering
      newOffering.color = this.getColor(index)
      this.$store.commit('addOffering', newOffering)
    },
    unhoverOffering: function () {
      this.$store.commit('unhoverOffering')
    },
    increaseCoursesShown: function () {
      this.coursesShown += 30
    },
    formatInstructor: function (instructors) {
      let instString = instructors[0]
      if (instString === 'TBA') {
        return 'Instructors TBA'
      }
      if (instructors.length === 1) {
        return instString
      } else {
        for (var i = 1; i < instructors.length; ++i) {
          instString = instString + ', ' + instructors[i]
        }
        return instString
      }
    }
  },
  computed: {
    searchTerm: {
      get () {
        return this.$store.state.searchTerm
      },
      set (value) {
        this.$store.commit('updateSearchTerm', value)
      }
    },
    courses: function () {
      return this.$store.state.results
    },
    isSplitscreen: function () {
      return {
        'splitscreen': this.$route.name === 'Splitscreen'
      }
    },
    departmentResults: function () {
      var results = []
      for (var i = 0; i < this.departments.length; ++i) {
        if (departments[i].name.toLowerCase().includes(this.$store.state.searchTerm.toLowerCase()) ||
        departments[i].acronym.toLowerCase().includes(this.$store.state.searchTerm.toLowerCase())) {
          results.push(departments[i])
        }
      }
      return results
    }
  }
}

</script>

<style scoped>

.search {
  flex-grow: 1;
  flex-basis: 0;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px 0px var(--body);
  z-index: 10;
  justify-content: center;
}

.small{
  font-size: 8px;
  cursor: pointer;
  margin-left: 6px;
}

.badge-pill {
}

.header {
  background-color: var(--red);
  padding: 8px 10px 8px 10px;
  user-select: none;
  flex-basis: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* @media screen and (max-width: 100) {
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: green;
    }
} */

@media (min-width: 850px) {
  .header {
    display:inline;
  }
}

.header-badges {
  width: 100%;
  max-width: 600px;
}

.header-title {
  display: flex;
  align-items: flex-start;
  position: relative;
  justify-content: center;
}

.headerTitle {
  padding-right: 20px;
  color: white;
}

.filtersContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid white;
  flex: 1 1 0;
  background-color: var(--red);
  padding: 10px;
}

.input {
  flex: 1 1 0;
  max-width: 500px;
  margin-bottom: 5px;
  margin-left: auto;
  /* display: flex;
  flex-direction: row;
  align-items: center; */
}

.input.mobile {
  margin-right: auto;
}

.searchResults {
  position: relative;
  width: 100%;
}

.form-control {
  border: none;
  border-radius: 3px;
  z-index: 25;
}

.autocompleteResults {
  z-index: 30;
  max-height: 250px;
  overflow: auto;
  margin-top: 2px;
  width: 100%;
  background-color: white;
  position: absolute;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

.autocompleteResult {
  padding: 5px;
  color: var(--body)
  /* border-radius: 3px; */
  /* border-bottom: 1px solid var(--light-gray) */
}

.autocompleteResult:hover {
  background-color: var(--light-gray)
}

.autocompleteResult.last {
  border-bottom: none;
}

.filter {
  color: white;
  padding-left: 10px;
  margin-top:10px;
  cursor: pointer;
  font-size: 20px;
}

.results {
  justify-content: center;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1 1 0;
  padding: 10px;
}

.noResults {
  margin: 50px auto 0px auto;
  width: 100%;
  text-align: center;
  color: var(--lightest-body);
}

.loader {
  border: 8px solid lightgray; /* Light grey */
  border-top: 8px solid var(--red); /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 50px auto 0px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card {
  padding: 5px 10px 0px 10px;
  margin: 0px auto 12px auto;
  flex-shrink: 0;
  max-width: 500px;
  border-radius: 1px;
  border: none;
  box-shadow: 0px 4px 5px rgb(203, 203, 203);
  color:var(--uilightblue);
  font-weight: 300;
  /* font-size: 13; */
}

.cardTop {
  display: flex;
  flex-direction: row;
  justify-content: space-between
}

.description {
  color: var(--lightest-body);
  padding-bottom: 7px;
  line-height: 1.3em;
  text-align: justify;
}

.offering {
  border-top: 1px solid var(--line);
  padding: 4px 5px 2px 10px;
  margin-left: -10px;
  margin-right: -10px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  font-size: 13px;
  align-items: flex-start;
  max-width: inherit;
}

.offering.selected {
  background: rgba(255, 251, 204, 0.9);
}

.offering:hover {
  background-color: rgba(152, 152, 152, 0.1);
}

.sectionNumber {
  width: 12%;
  max-width: 50px;
  padding-right: 5px;
}

.instructor {
  width: 20%;
  /* position: absolute; */
  /* white-space: nowrap; */
  /* overflow:auto; */
  /* text-overflow: ellipsis; */
}

.meetsBox {
  margin-left: 7%;
}

.days {
  display: flex;
  align-items: center;
  height: 20px;
  margin-left: auto;
  justify-content: flex-start;
  padding-bottom: 2px;
}

.day {
  margin-right: 4px;
  height: 13px;
  width: 13px;
  background-color: var(--uilightblue);
  border-radius: 1px;
}

.crn {
  margin-left: auto;
  margin-right: 4px;
}

.outline {
  background-color: transparent !important
}

.time {
  padding-left: 5px;
  width: 100px;
}

/* .offeringArrow {
font-size: 24px;
cursor: pointer;
position: relative;
top: -2px;
} */

.loadMoreDiv {
  width: 100;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 15px;
}

.btn-primary {
  font-size: 14px;
}

.btn-circle {
  /* width: 30px; */
  height: 25px;
  color: white;
  text-align: center;
  /* padding: 6px 0; */
  font-size: 10px;
  line-height: 0;
  border-radius: 15px;
}

.badge-primary {
  height: 20px;
  color: red;
  width: 20px;
  text-align: center;
  padding: 0px;
  background-color: transparent;
  transition: background-color 0.25s ease-out;
}

.badge-primary:hover {
  background-color: lightgray;
  height: 20px;
  color: red;
  width: 20px;
  text-align: center;
  padding: 0px;
}

</style>
