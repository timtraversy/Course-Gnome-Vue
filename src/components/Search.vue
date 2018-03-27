<template>
  <div class="search" :class="isSplitscreen">
    <div class = "header">
      <h1 v-if = "$mq != 'sm' && $mq != 'xsm'" class = "headerTitle">Search</h1>
      <div class = "input">
        <input autofocus class="form-control" aria-describedby="searchTerm" placeholder="What are you looking for?">
        <i class="material-icons filter">filter_list</i>
      </div>
      <!-- <span class="badge badge-pill badge-light">Computer Science<i class="material-icons small">clear</i></span> -->
      <!-- <span class="badge badge-pill badge-light">Open<i class="material-icons small">clear</i></span> -->
    </div>
    <div class = "results">
      <!-- <div class="loader"></div> -->
      <div v-for="(course, index) in courses" :key="course.id" class = "card" :style = "cardColor(index)">
          <div class = "cardTop">
            <span style ="margin-left:0px">{{course.subjectAcronym}} {{course.subjectNumberString}}</span><span>{{course.credit}} credits</span>
          </div>
          <h2>{{course.courseName}}</h2>
          <span class = "description">A mathematical treatment of fair representation, voting systems, power
            and the feeling of being alive for the first time.</span>
            <div class = "offering">
              <span class = "sectionNumber">11</span>
              <span class = "instructor">Basu, K</span>
              <div class = "meetsBox">
                <div class = "days">
                  <div class = "day">
                  </div>
                  <div class = "day outline">
                  </div>
                  <div class = "day">
                  </div>
                  <div class = "day outline">
                  </div>
                  <div class = "day">
                  </div>
                  <span v-if = "$mq != 'xsm'" class = "time">12:10 - 3:30</span>
                </div>
              </div>
              <span class = "crn">31489</span>
              <i class="material-icons offeringArrow">keyboard_arrow_down</i>
            </div>
        </div>
      </div>
    </div>
  </template>

<script>

import { flatui } from '../main'

export default {
  name: 'Search',
  data () {
    return {
      searchTerm: '',
      courses: [],
      obj: {
        color: 'red',
        fontSize: '50px'
      }
    }
  },
  methods: {
    reverseMessage: function () {
      this.$router.push('search')
    },
    cardColor: function (index) {
      if (index % 9 === 0) { return { color: flatui.red, borderLeft: '7px solid var(--uired)' } }
      if (index % 9 === 1) { return { color: flatui.orange, borderLeft: '7px solid var(--uiorange)' } }
      if (index % 9 === 2) { return { color: flatui.gold, borderLeft: '7px solid var(--uigold)' } }
      if (index % 9 === 3) { return { color: flatui.green, borderLeft: '7px solid var(--uigreen)' } }
      if (index % 9 === 4) { return { color: flatui.turquoise, borderLeft: '7px solid var(--uiturquoise)' } }
      if (index % 9 === 5) { return { color: flatui.lightblue, borderLeft: '7px solid var(--uilightblue)' } }
      if (index % 9 === 6) { return { color: flatui.darkblue, borderLeft: '7px solid var(--uidarkblue)' } }
      if (index % 9 === 7) { return { color: flatui.purple, borderLeft: '7px solid var(--uipurple)' } }
      if (index % 9 === 8) { return { color: flatui.gray, borderLeft: '7px solid var(--uigray)' } }
    }
  },
  computed: {
    isSplitscreen: function () {
      return {
        'splitscreen': this.$route.name === 'Splitscreen'
      }
    }
  },
  firestore () {
    return {
      // courses: db.collection('coursesSpring2018').where('subjectAcronym', '==', 'MATH')
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
  box-shadow: 5px 0 6px -2px rgb(203, 203, 203);
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
  background-color: var(--uilightblue);
  padding: 8px 15px 5px 15px;
}

.headerTitle {
  color: white
}

.input {
  max-width: 500px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.form-control {
  border: none;
  border-radius: 3px;
}

.form-control:focus {
  border: none;
  box-shadow: inset 0 -10px 0px -8px var(--red);
}

.filter {
  color: white;
  padding-left: 10px;
  cursor: pointer;
}

.results {
  flex: 1;
  overflow: auto;
  padding: 15px;
}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid var(--red); /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 20% auto 0px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card {
  padding: 5px 10px 0px 10px;
  margin: 12px auto 0px auto;
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
}

.offering:hover {
  background-color: rgba(152, 152, 152, 0.1);
}

.sectionNumber {
  width: 15%;
  max-width: 50px;
  padding-right: 5px;
}

.instructor {
  width: 23%;
  padding-right: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meetsBox {
  /* margin-left: ; */
  padding-left: 2%;
  margin-left: 10px;
}

.days {
  display: flex;
  align-items: center;
  height: 20px;
  margin-left: auto;
  justify-content: flex-start;
  padding-bottom: 2px;
}

.days:nth-child(n+2) {
  /* margin-top: 4px; */
}

.day {
  margin-right: 4px;
  height: 15px;
  width: 15px;
  background-color: var(--uilightblue);
  border-radius: 1px;
}

.crn {
  padding-left: 3px;
  margin-left: auto;
  margin-right: 5px;
}

.outline {
  background-color: transparent;
  border: 1px solid var(--uilightblue);
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

</style>
