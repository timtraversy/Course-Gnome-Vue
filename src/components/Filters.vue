<template>
  <div class="filters">
    <div class="scrollBox">
      <div class = "inputBox">
        <div class = "inputLabel">NAME INCLUDES</div>
        <input v-model="searchObject.name" class="form-control" aria-describedby="Name" placeholder="Calculus, spanish">
      </div>
      <div class = "inputBox">
        <!-- <div class = "clearButton">
          <i class = "material-icons">clear</i>
        </div> -->
        <div class = "inputLabel">DEPARTMENT</div>
        <input @focus = "departmentDropdown = true" v-click-outside="() => departmentDropdown = false" @keyup.down="go"
        v-model="searchObject.departmentName" class="form-control" aria-describedby="Department" placeholder="Acrobatics, wizardry...">
        <div class = "autocompleteResults" v-if = "departmentDropdown">
          <div v-on:click = "searchObject.departmentName = department"
          v-for="department in matchingDepartments" :key = "department" class = "autocompleteResult">
            {{ department }}
          </div>
        </div>
      </div>
      <div class = "inputBox">
        <div class = "inputLabel">INSTRUCTOR</div>
        <input @focus = "instructorDropdown = true" v-click-outside="() => instructorDropdown = false" @keyup.down="go"
        v-model="searchObject.instructor" class="form-control" aria-describedby="Instructor" placeholder="Ms. Bartholomew, Mr. S...">
        <div class = "autocompleteResults" v-if = "instructorDropdown">
          <div v-on:click = "searchObject.instructor = instructor"
          v-for="instructor in matchingInstructors" :key = "instructor" class = "autocompleteResult">
            {{ instructor }}
          </div>
        </div>
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
    <button class = "btn btn-warning submit" v-on:click="$emit('search-edit', 'hello')">
      See 10 courses
      <i class = "material-icons arrow">arrow_right_alt</i>
    </button>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import { flatui } from '../main'
import { getDropdownData } from '../networking/database.js'
import ClickOutside from 'vue-click-outside'

export default {
  name: 'Filters',
  components: {
    vueSlider
  },
  directives: {
    ClickOutside
  },
  props: ['searchObject'],
  mounted () {
    const result = getDropdownData(this.$route.params.school, this.$store)
    this.departments = result.departments
    this.instructors = result.instructors
  },
  data () {
    return {
      timeOptions: {
        value: ['8:00 AM', '10:00 PM'],
        width: '80%',
        height: 4,
        dotSize: 14,
        min: 1,
        max: 100,
        interval: 3,
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
      numberOptions: {
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
      },
      departmentDropdown: false,
      instructorDropdown: false,
      departments: [],
      instructors: []
    }
  },
  methods: {
    go: function () {
      console.log('hi')
    }
  },
  computed: {
    matchingDepartments: function () {
      if (this.searchObject.departmentName === '') {
        return this.departments
      } else {
        let arr = []
        for (var i = 0; i < this.departments.length; ++i) {
          const dept = this.departments[i]
          if (dept.includes(this.searchObject.departmentName)) {
            arr.push(dept)
          }
        }
        return arr
      }
    },
    matchingInstructors: function () {
      if (this.searchObject.instructor === '') {
        return this.instructors
      } else {
        let arr = []
        for (var i = 0; i < this.instructors.length; ++i) {
          const inst = this.instructors[i]
          if (inst.includes(this.searchObject.instructor)) {
            arr.push(inst)
          }
        }
        return arr
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
  padding-right: 18px;
}

.inputBox {
  margin-bottom: 20px;
}

.clearButton {
  position: absolute;
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
