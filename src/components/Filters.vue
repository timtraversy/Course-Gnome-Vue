<template>
  <div class="filters">
    <div class="scrollBox">
      <div class = "inputBox">
        <div class = "inputLabel">NAME INCLUDES</div>
        <div class = "inputClearBox">
          <input v-model="searchObject.name" class="form-control" aria-describedby="Name" placeholder="Calculus, spanish">
          <div v-if = "searchObject.name" class = "clearButton" v-on:click="searchObject.name=''">
            <i class = "material-icons">clear</i>
          </div>
        </div>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">DEPARTMENT</div>
        <Autocomplete v-on:select="searchObject.departmentName=$event" v-bind:options="{placeholder:'Acrobatics, wizardry...',selected:searchObject.departmentName,list:this.departments}"></Autocomplete>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">INSTRUCTOR</div>
        <Autocomplete v-on:select="searchObject.instructor=$event" v-bind:options="{placeholder:'Ms. Stevens, Mr. Burtle...',selected:searchObject.instructor,list:this.instructors}"></Autocomplete>
      </div>
      <div class = "inputBox" >
        <div class = "inputLabel">TIME</div>
        <div class = "sliderBox">
          <vue-slider class = "slider" ref="timeSlider" v-model="searchObject.time" v-bind="timeOptions"></vue-slider>
        </div>
      </div>
      <div class = "inputBox" >
        <div class = "inputLabel">COURSE NUMBER</div>
        <div class = "sliderBox">
          <vue-slider class = "slider" ref="numberSlider" v-model="searchObject.number" v-bind="numberOptions"></vue-slider>
        </div>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">DAYS</div>
        <div class="btn-group days" role="group" aria-label="Basic example">
          <button v-on:click="searchObject.monday = !searchObject.monday"
          v-bind:class = "{ active: searchObject.monday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Mon</button>
          <button v-on:click="searchObject.tuesday = !searchObject.tuesday"
          v-bind:class = "{ active: searchObject.tuesday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Tue</button>
          <button v-on:click="searchObject.wednesday = !searchObject.wednesday"
          v-bind:class = "{ active: searchObject.wednesday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Wed</button>
          <button v-on:click="searchObject.thursday = !searchObject.thursday"
          v-bind:class = "{ active: searchObject.thursday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Thur</button>
          <button v-on:click="searchObject.friday = !searchObject.friday"
          v-bind:class = "{ active: searchObject.friday }" type="button" class="btn btn-primary day" data-toggle="button" aria-pressed="false" autocomplete="off">Fri</button>
        </div>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">STATUS</div>
        <div class="btn-group days" role="group" aria-label="Basic example">
          <button v-on:click="searchObject.open = !searchObject.open"
          v-bind:class = "{ active: searchObject.open }" type="button" class="btn btn-primary status" data-toggle="button" aria-pressed="false" autocomplete="off">Open</button>
          <button v-on:click="searchObject.waitlist = !searchObject.waitlist"
          v-bind:class = "{ active: searchObject.waitlist }" type="button" class="btn btn-primary status" data-toggle="button" aria-pressed="false" autocomplete="off">Waitlist</button>
          <button v-on:click="searchObject.closed = !searchObject.closed"
          v-bind:class = "{ active: searchObject.closed }" type="button" class="btn btn-primary status" data-toggle="button" aria-pressed="false" autocomplete="off">Closed</button>
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
import { getDropdownData } from '../networking/database.js'
import Autocomplete from '../components/Autocomplete'

export default {
  name: 'Filters',
  components: {
    vueSlider, Autocomplete
  },
  props: ['searchObject', 'blankObject'],
  mounted () {
    const result = getDropdownData(this.$route.params.school, this.$store)
    this.departments = result.departments
    this.instructors = result.instructors
    this.departmentInput = this.searchObject.departmentName
    this.instructorInput = this.searchObject.instructor
  },
  data () {
    return {
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
      },
      departments: [],
      instructors: []
    }
  },
  methods: {
  },
  computed: {
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
      if (this.$store.state.totalResultCount > 1) {
        return `See ${this.$store.state.totalResultCount} courses`
      } else if (this.$store.state.totalResultCount === 1) {
        return 'See 1 course'
      } else {
        if (JSON.stringify(this.searchObject) !== JSON.stringify(this.blankObject)) {
          return 'No results! Try broadening your search'
        } else {
          return 'Try entering some search terms'
        }
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
  overflow: scroll;
  width: 100%;
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
