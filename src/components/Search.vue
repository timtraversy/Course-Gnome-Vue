<template>
  <div class="search" :class="isSplitscreen">
    <div class = "header">
      <div class = "header-badges">
        <div class = "header-title">
          <h1 v-if = "$mq != 'sm' && $mq != 'xsm'" class = "headerTitle">Search</h1>
          <Autocomplete v-bind:options="{placeholder:'Search for anything...', list:this.$store.getters.dropdownData.global, type:'global'}"></Autocomplete>
          <i class="material-icons filter" v-on:click="filtersOpen = !filtersOpen">filter_list</i>
        </div>
        <span v-if="this.$store.state.searchObject.name" class="badge badge-pill badge-light info-badge">Name Includes: {{ this.$store.state.searchObject.name }}<i class="material-icons small" v-on:click="clearBadge('name')">clear</i></span>
        <span v-if="this.$store.state.searchObject.departmentName" class="badge badge-pill badge-light info-badge">Department: {{ this.$store.state.searchObject.departmentName }}<i class="material-icons small" v-on:click="clearBadge('departmentName')">clear</i></span>
        <span v-if="this.$store.state.searchObject.instructor" class="badge badge-pill badge-light info-badge">Instructor: {{ this.$store.state.searchObject.instructor }}<i class="material-icons small" v-on:click="clearBadge('instructor')">clear</i></span>
      </div>
    </div>
    <div class = "filtersContainer" v-if="filtersOpen">
      <Filters v-on:close-filters="filtersOpen = false"></Filters>
    </div>
    <div class = "results" v-show = "!filtersOpen" id = "results">
      <div v-if = "waitingForResults" class="loader"></div>
      <!-- <div v-if = "searchedOnce && courses.length == 0 && !waitingForResults" class="noResults"><h1>No results!</h1></div> -->
      <div v-for="(course, courseIndex) in courses.slice(0,coursesShown)" :key="course.id" class = "card" :style = "cardColor(courseIndex)">
        <div class = "cardTop">
          <span style ="margin-left:0px">{{course.departmentAcronym}} {{course.departmentNumber}}</span><span>{{course.credit}} credits</span>
        </div>
        <h2>{{course.name}}</h2>
        <span v-if = "course.description" class = "description"> {{ course.description }} </span>
        <div v-for="(offer) in course.offerings" :key="offer.id" class = "offering"
        v-on:mouseenter="hoverOffering(course, offer, courseIndex)" v-on:mouseleave="unhoverOffering()"
        v-on:click="addOrRemoveOffering(course, offer, courseIndex)" :style = "selected(offer.id,courseIndex)">
          <span class = "sectionNumber">{{ offer.sectionNumber }}</span>
          <span v-if="offer.instructors" class = "instructor"> {{formatInstructor(offer.instructors)}} </span>
          <span v-else class = "instructor">Instructors TBA</span>
          <div class = "meetsBox" v-if = "offer.classTimes && offer.classTimes.length !== 0">
            <div v-for="classTime in offer.classTimes" :key="classTime.id" class = "days">
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.monday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.tuesday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.wednesday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.thursday == false}"></div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.friday == false}"></div>
              <span v-if = "$mq != 'xsm'" class = "time">{{ formatTime(classTime.startTime) }} - {{ formatTime(classTime.endTime) }}</span>
            </div>
          </div>
          <span v-else class = "meetsBox">
            Times TBA
          </span>
          <span class = "id">{{ offer.id }}</span>
          <!-- <button v-on:click.stop="print()" type="button" class="btn btn-default btn-circle"><i class="material-icons offeringArrow">keyboard_arrow_down</i></button> -->
          <!-- <span v-on:click = "print()" v-on:click.stop :style = "{color: getColor(courseIndex)}" class="badge badge-pill badge-primary"><i class="material-icons offeringArrow">keyboard_arrow_down</i></span> -->
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
import Filters from '../components/Filters'
import Autocomplete from '../components/Autocomplete'
// import { debounce } from 'debounce'

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
      filtersOpen: false
    }
  },
  mounted () {
    // document.getElementById('results').scrollTop = this.$store.state.scrollPosition
    // console.log(this.$store.state.scrollPosition)
    // if (this.$route.params.school === 'emerson') {
    //   this.searchObject.number = [100, 1000]
    //   this.previousSearchObject.number = [100, 1000]
    //   this.blankSearchObject.number = [100, 1000]
    // }
  },
  methods: {
    clearBadge: function (type) {
      var obj = {}
      obj[type] = null
      this.$store.commit('updateSearchObject', obj)
    },
    convertHex: function (hex, opacity) {
      hex = hex.replace('#', '')
      var r = parseInt(hex.substring(0, 2), 16)
      var g = parseInt(hex.substring(2, 4), 16)
      var b = parseInt(hex.substring(4, 6), 16)
      var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')'
      return result
    },
    selected: function (id, index) {
      const currentCalendar = this.$store.state.calendars[this.$store.state.currentCalendar]
      if (currentCalendar.offerings[currentCalendar.history].some(offering => {
        return offering.id === id
      })) return { backgroundColor: '' + this.convertHex(this.getColor(index), 0.1) }
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
    hoverOffering: function (course, offering, index) {
      this.$store.commit('hoverOffering', {course: course, offering: offering, color: this.getColor(index)})
    },
    addOrRemoveOffering: function (course, offering, index) {
      this.$store.commit('addOrRemoveOffering', {course: course, offering: offering, color: this.getColor(index)})
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
      return this.$store.getters.matchingCourses
    },
    isSplitscreen: function () {
      return {
        'splitscreen': this.$route.name === 'Splitscreen'
      }
    }
  }
}

</script>

<style scoped>

.search {
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px 0px var(--body);
  /* border-right: 1px solid var(--loght); */
  z-index: 10;
  justify-content: center;
}

.small{
  font-size: 8px;
  cursor: pointer;
  margin-left: 6px;
}

.header {
  background-color: var(--red);
  padding: 12px 10px 10px 10px;
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
    padding: 12px 10px 4px 10px;
  }
  .header-badges {
    margin-bottom: 6px;
  }
  .info-badge {
    margin-top: 7px;
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
  /* margin-bottom: 5px; */
  justify-content: center;
}

.headerTitle {
  padding-right: 20px;
  color: white;
}

.info-badge {
  margin-top: 11px;
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

.id {
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
