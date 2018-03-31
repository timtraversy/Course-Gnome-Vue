<template>
  <div class="search" :class="isSplitscreen">
    <div class = "header">
      <h1 v-if = "$mq != 'sm' && $mq != 'xsm'" class = "headerTitle">Search</h1>
      <div class = "input" :class="{ mobile: ($mq === 'sm' || $mq === 'xsm')}">
        <div class = "searchResults">
          <input v-click-outside="hideAutocompleteResults" v-on:keyup.esc="hideAutocompleteResults"
          @focus = "autocompleteResultsShown = true" v-model="searchTerm" class="form-control" aria-describedby="Enter your search terms" placeholder="What are you looking for?">
          <div class = "autocompleteResults" v-if = "autocompleteResultsShown">
            <div v-on:click = "selectDepartment(department)" v-for="department in departmentResults" :key = "department.acronym" class = "autocompleteResult">
              {{ department.name }}
            </div>
          </div>
        </div>
        <i class="material-icons filter">filter_list</i>
      </div>
      <!-- <span class="badge badge-pill badge-light">Computer Science<i class="material-icons small">clear</i></span> -->
    </div>
    <div class = "results">
      <div v-if = "waitingForResults" class="loader"></div>
      <div v-if = "searchedOnce && courses.length == 0 && !waitingForResults" class="noResults"><h1>No results!</h1></div>
      <div v-for="(course, courseIndex) in courses.slice(0,coursesShown)" :key="course.id" class = "card" :style = "cardColor(courseIndex)">
        <div class = "cardTop">
          <span style ="margin-left:0px">{{course.data.departmentAcronym}} {{course.data.departmentNumber}}</span><span>{{course.data.credit}} credits</span>
        </div>
        <h2>{{course.data.name}}</h2>
        <span v-if = "course.data.description" class = "description">{{ course.data.description }}</span>
        <div v-for="(offer) in course.offerings" :key="offer.id" class = "offering"
        v-on:mouseenter="hoverOffering(offer, courseIndex)" v-on:mouseleave="unhoverOffering()"
        v-on:click="addOrRemoveOffering(offer, courseIndex)" :style = "selected(offer.id,courseIndex)">
          <span class = "sectionNumber">{{ offer.data.sectionNumber }}</span>
          <span v-if="offer.data.instructors" class = "instructor"> {{offer.data.instructors}} </span>
          <span v-else class = "instructor"> TBD </span>
          <div class = "meetsBox">
            <div v-for="classTime in offer.data.classTimes" :key="classTime.id" class = "days">
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.monday == false}">
              </div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.tuesday == false}">
              </div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.wednesday == false}">
              </div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.thursday == false}">
              </div>
              <div :style = "boxColor(courseIndex)" class = "day" :class="{ outline: classTime.friday == false}">
              </div>
              <span v-if = "$mq != 'xsm'" class = "time">{{ formateTime(classTime.startTime) }} - {{ formateTime(classTime.endTime) }}</span>
            </div>
          </div>
          <span class = "crn">{{ offer.id }}</span>
          <i class="material-icons offeringArrow">keyboard_arrow_down</i>
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
import { db } from '../private/firestore'
import moment from 'moment'
import { departments } from '../lists/departments'
import ClickOutside from 'vue-click-outside'

export default {
  name: 'Search',
  directives: {
    ClickOutside
  },
  data () {
    return {
      searchTerm: '',
      coursesShown: 30,
      departments: departments,
      autocompleteResultsShown: false,
      waitingForResults: false,
      searchedOnce: false
    }
  },
  methods: {
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
    reverseMessage: function () {
      this.$router.push('search')
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
    formateTime: function (value) {
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
      // console.log('out')
      this.$store.commit('unhoverOffering')
    },
    increaseCoursesShown: function () {
      this.coursesShown += 30
    },
    hideAutocompleteResults: function () {
      this.autocompleteResultsShown = false
    },
    selectDepartment: function (department) {
      this.searchedOnce = true
      this.$store.commit('updateResults', [])
      this.waitingForResults = true
      this.searchTerm = department.name
      var offeringsRef = db.collection('/schools/gwu/seasons/fall2018/offerings')
        .where('departmentAcronym', '==', department.acronym)
      var results = []
      var self = this
      offeringsRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (offering) {
          var newOffering = {}
          newOffering.id = offering.id
          newOffering.data = offering.data()
          results.push(newOffering)
        })
        results.sort(function (a, b) {
          if (a.data.departmentNumber > b.data.departmentNumber) {
            if (a.data.departmentAcronym > b.data.departmentAcronym) {
              if (a.data.sectionNumber > b.data.sectionNumber) {
                return 1
              } else {
                return -1
              }
            } else if (a.data.departmentAcronym < b.data.departmentAcronym) {
              return -1
            } else {
              return 0
            }
          } else if (a.data.departmentNumber < b.data.departmentNumber) {
            return -1
          }
        })
        var finalOfferings = []
        var j = -1
        var previousNumber = ''
        var previousAcronym = ''
        var previousName = ''
        for (var i = 0; i < results.length; ++i) {
          // if another offering of last course, add it to that list
          if (previousNumber === results[i].data.departmentNumber &&
            previousAcronym === results[i].data.departmentAcronym &&
            previousName === results[i].data.name) {
            finalOfferings[j].offerings.push(results[i])
          // otherwise make new course
          } else {
            finalOfferings.push(results[i])
            results[i].offerings = [results[i]]
            previousNumber = results[i].data.departmentNumber
            previousAcronym = results[i].data.departmentAcronym
            previousName = results[i].data.name
            j++
          }
        }
        self.waitingForResults = false
        self.$store.commit('updateResults', finalOfferings)
      })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    }
  },
  computed: {
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
        if (departments[i].name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            departments[i].acronym.toLowerCase().includes(this.searchTerm.toLowerCase())) {
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
    font-size: 10px;
    cursor: pointer;
    margin-left: 6px;
  }

  .badge-pill {
    margin-right: 7px;
    margin-bottom: 3px;
  }

  .header {
    background-color: var(--red);
    padding: 8px 15px 5px 15px;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 60px;
    align-items: center;
    display: flex;
  }

  .headerTitle {
    padding-right: 20px;
    color: white;
  }

  .input {
    flex: 1 1 0;
    max-width: 500px;
    margin-bottom: 5px;
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
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
    cursor: pointer;
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
    box-shadow: 0px 4px 5px rgb(203, 203, 203);;
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
    /* height: 50px; */
    /* white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    position: absolute; */
  }

  .offering {
    border-top: 1px solid var(--line);
    padding: 6px 10px 2px 10px;
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

  .offeringArrow {
    font-size: 24px;
    cursor: pointer;
    position: relative;
    top: -2px;
  }

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

</style>
