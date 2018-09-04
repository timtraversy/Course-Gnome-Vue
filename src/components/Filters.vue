<template>
  <div class="filters">
    <div class="scrollBox">
      <div class = "inputBox">
        <div class = "inputLabel">NAME INCLUDES</div>
        <div class = "inputClearBox">
          <input v-model="name" class="form-control" aria-describedby="Name" placeholder="Calculus, spanish">
          <div v-if = "name" class = "clearButton" v-on:click="name = null">
            <i class = "material-icons">clear</i>
          </div>
        </div>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">DEPARTMENT</div>
        <Autocomplete v-bind:options="{placeholder:'Acrobatics, wizardry...', list:this.$store.getters.dropdownData.dept, type:'departmentName'}"></Autocomplete>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">INSTRUCTOR</div>
        <Autocomplete v-bind:options="{placeholder:'Ms. Stevens, Mr. Burtle...',list:this.$store.getters.dropdownData.inst, type:'instructor'}"></Autocomplete>
      </div>
      <div class = "inputBox" >
        <div class = "inputLabel">TIME</div>
        <div class = "sliderBox">
          <vue-slider class = "slider" ref="timeSlider" v-bind="timeOptions" v-model="times"></vue-slider>
        </div>
      </div>
      <div class = "inputBox" >
        <div class = "inputLabel">COURSE NUMBER</div>
        <div class = "sliderBox">
          <vue-slider class = "slider" ref="numberSlider" v-model="numbers" v-bind="numberOptions"></vue-slider>
        </div>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">DAYS</div>
        <div class="btn-group days" role="group" aria-label="Basic example">
          <button v-on:click="setSearchObject('monday')"
          v-bind:class = "{ active: this.$store.state.searchObject.monday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Mon</button>
          <button v-on:click="setSearchObject('tuesday')"
          v-bind:class = "{ active: this.$store.state.searchObject.tuesday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Tue</button>
          <button v-on:click="setSearchObject('wednesday')"
          v-bind:class = "{ active: this.$store.state.searchObject.wednesday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Wed</button>
          <button v-on:click="setSearchObject('thursday')"
          v-bind:class = "{ active: this.$store.state.searchObject.thursday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Thur</button>
          <button v-on:click="setSearchObject('friday')"
          v-bind:class = "{ active: this.$store.state.searchObject.friday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Fri</button>
        </div>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">STATUS</div>
        <div class="btn-group days" role="group" aria-label="Basic example">
          <button v-on:click="setSearchObject('open')"
          v-bind:class = "{ active: this.$store.state.searchObject.open }" type="button" class="btn btn-primary status" data-toggle="button" aria-pressed="false" autocomplete="off">Open</button>
          <button v-on:click="setSearchObject('waitlist')"
          v-bind:class = "{ active: this.$store.state.searchObject.waitlist }" type="button" class="btn btn-primary status" data-toggle="button" aria-pressed="false" autocomplete="off">Waitlist</button>
          <button v-on:click="setSearchObject('closed')"
          v-bind:class = "{ active: this.$store.state.searchObject.closed }" type="button" class="btn btn-primary status" data-toggle="button" aria-pressed="false" autocomplete="off">Closed</button>
        </div>
      </div>
    </div>
    <button class = "btn btn-warning submit" v-on:click="$emit('close-filters')">
      {{ resultsCount }}
      <i class = "material-icons arrow">arrow_right_alt</i>
    </button>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import { flatui } from '../main'
import Autocomplete from '../components/Autocomplete'
import { debounce } from 'debounce'

export default {
  name: 'Filters',
  components: {
    vueSlider, Autocomplete
  },
  props: ['searchObject', 'blankObject'],
  created () {
    if (this.$route.params.school === 'emerson') {
      this.minNumber = 100
      this.maxNumber = 1000
    }
  },
  mounted () {
  },
  data () {
    return {
      minNumber: 1000,
      maxNumber: 10000,
      timeOptions: {
        value: ['8:00 AM', '10:00 PM'],
        width: '80%',
        height: 4,
        dotSize: 14,
        disabled: false,
        show: true,
        tooltip: 'always',
        piecewise: false,
        processStyle: {
          'backgroundColor': '#007bff'
        },
        data: [
          '8:00 AM',
          '8:30 AM',
          '9:00 AM',
          '9:30 AM',
          '10:00 AM',
          '10:30 AM',
          '11:00 AM',
          '11:30 AM',
          '12:00 PM',
          '12:30 PM',
          '1:00 PM',
          '1:30 PM',
          '2:00 PM',
          '2:30 PM',
          '3:00 PM',
          '3:30 PM',
          '4:00 PM',
          '4:30 PM',
          '5:00 PM',
          '5:30 PM',
          '6:00 PM',
          '6:30 PM',
          '7:00 PM',
          '7:30 PM',
          '8:00 PM',
          '8:30 PM',
          '9:00 PM',
          '9:30 PM',
          '10:00 PM'
        ],
        tooltipStyle: {
          'backgroundColor': 'white',
          'borderColor': 'white',
          'color': flatui.gray
        }
      }
    }
  },
  methods: {
    debounceCommit: debounce(function (type, value) {
      var obj = {}
      obj[type] = value
      this.$store.commit('updateSearchObject', obj)
    }, 300),
    setSearchObject: function (day) {
      var obj = {}
      obj[day] = !this.$store.state.searchObject[day]
      this.$store.commit('updateSearchObject', obj)
    }
  },
  computed: {
    name: {
      get () {
        return this.$store.state.searchObject.name
      },
      set (value) {
        if (value !== null && value !== '') {
          this.debounceCommit('name', value)
        } else {
          this.$store.commit('updateSearchObject', {'name': null})
        }
      }
    },
    times: {
      get () {
        var start = this.$store.state.searchObject.startTime
        var end = this.$store.state.searchObject.endTime
        if (this.$store.state.searchObject.startTime === null) {
          start = '8:00 AM'
        }
        if (this.$store.state.searchObject.endTime === null) {
          end = '10:00 PM'
        }
        return [start, end]
      },
      set (value) {
        if (value[0] !== '8:00 AM' && value[0] !== this.$store.state.searchObject.startTime) {
          this.debounceCommit('startTime', value[0])
        }
        if (value[0] === '8:00 AM' && this.$store.state.searchObject.startTime !== null) {
          this.debounceCommit('startTime', null)
        }
        if (value[1] !== '10:00 PM' && value[1] !== this.$store.state.searchObject.endTime) {
          this.debounceCommit('endTime', value[1])
        }
        if (value[1] === '10:00 PM' && this.$store.state.searchObject.endTime !== null) {
          this.debounceCommit('endTime', null)
        }
      }
    },
    numbers: {
      get () {
        var start = this.$store.state.searchObject.startNumber
        var end = this.$store.state.searchObject.endNumber
        if (this.$store.state.searchObject.startNumber === null) {
          start = this.minNumber
        }
        if (this.$store.state.searchObject.endNumber === null) {
          end = this.maxNumber
        }
        return [start, end]
      },
      set (value) {
        if (value[0] !== this.minNumber && value[0] !== this.$store.state.searchObject.startNumber) {
          this.debounceCommit('startNumber', value[0])
        }
        if (value[0] === this.minNumber && this.$store.state.searchObject.startNumber !== null) {
          this.debounceCommit('startNumber', null)
        }
        if (value[1] !== this.maxNumber && value[1] !== this.$store.state.searchObject.endNumber) {
          this.debounceCommit('endNumber', value[1])
        }
        if (value[1] === this.maxNumber && this.$store.state.searchObject.endNumber !== null) {
          this.debounceCommit('endNumber', null)
        }
      }
    },
    numberOptions: function () {
      const numberOptions = {
        value: [1000, 10000],
        width: '80%',
        height: 4,
        dotSize: 14,
        min: 1000,
        max: 10000,
        interval: 100,
        disabled: false,
        show: true,
        tooltip: 'always',
        piecewise: false,
        tooltipStyle: {
          'backgroundColor': 'white',
          'borderColor': 'white',
          'color': flatui.gray
        },
        processStyle: {
          'backgroundColor': '#007bff'
        }
      }
      if (this.$route.params.school === 'emerson') {
        numberOptions.min = 100
        numberOptions.interval = 50
        numberOptions.max = 1000
        numberOptions.value = [100, 1000]
      }
      return numberOptions
    },
    resultsCount: function () {
      if (this.$store.getters.blankSearch) return 'Try entering some search terms'
      if (this.$store.getters.matchingCourses.length > 1) {
        return `See ${this.$store.getters.matchingCourses.length} courses`
      } else if (this.$store.getters.matchingCourses.length === 1) {
        return 'See 1 course'
      } else {
        return 'No results! Try broadening your search'
      }
    }
  }
}
</script>

<style scoped>

.filters {
  width: 100%;
  height: 100%;
  margin-top: 5px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  user-select: none;
  align-items: center;
}

.scrollBox {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  flex-grow: 1;
}

.inputBox {
  margin-bottom: 20px;
}

.inputClearBox {
  position: relative;
}

.clearButton {
  position: absolute;
  right:8px;
  top: 7px;
  cursor: pointer;
}

.inputLabel {
  font-size: 12px;
  color: white;
  font-weight: bold;
  letter-spacing: 1px;
}

.sliderBox {
  display: flex;
  justify-content: center;
}

.slider {
  margin-top: 40px;
}

.days {
  width: 100%;
}

.day {
  width: 20%;
}

.status {
  width: 33%
}

.submit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 20px;
  margin-bottom: 20px;
}

.arrow {
  margin-left: 10px;
}

.autocompleteResults {
  z-index: 30;
  max-height: 150px;
  overflow: auto;
  margin-top: 2px;
  width: 100%;
  background-color: white;
  /* position: absolute; */
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}

.autocompleteResult {
  padding: 3px 10px 3px 10px;
  border-radius: 3px;
  border-bottom: 1px solid var(--light-gray)
}

.autocompleteResult:hover {
  background-color: var(--light-gray)
}

</style>
