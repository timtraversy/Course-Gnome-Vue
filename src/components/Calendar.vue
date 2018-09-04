<template>
  <div class="calendarMain">
    <div class = "header" ref="header" id="header">
      <div class = "headerTitle" ref="headerTitle" id="headerTitle">
        <h1 v-if = "$mq != 'sm' && $mq != 'xsm'">Calendar</h1>
      </div>
      <div v-if = "showArrows" class = "nav-button" v-on:click="scrollLeft()">
        <i class="material-icons">chevron_left</i>
      </div>
      <ul class="nav nav-tabs" ref="tabs" id="tabs">
        <li v-for = "(calendar, index) in this.$store.state.calendars" v-bind:key = "calendar.name" class="nav-item" v-on:dblclick="editName(index)" v-on:click="currentCalendar = index">
          <a class="nav-link" :class="{selected: currentCalendar === index}">
            <span v-if="editing !== index">
              {{ calendar.name }}
              <i v-if="currentCalendar === index" class="material-icons delete" v-on:click.stop="deleteCalendar(index)">clear</i>
            </span>
            <div v-else>
              <input autofocus ref="edit" class = "cal-input" v-bind:placeholder="calendar.name" @blur="cancelEdit(index)" @keyup.enter="commitEdit(index)" v-model.lazy="calendarName">
                <i class="material-icons edit-button" v-on:click="commitEdit(index)">check</i><i class="material-icons edit-button" v-on:click="cancelEdit(index)">clear</i>
            </div>
          </a>
        </li>
      </ul>
      <div v-if = "showArrows" class = "nav-button" v-on:click="scrollRight()">
        <i class="material-icons">chevron_right</i>
      </div>
      <div class = "nav-button" v-on:click="addCalendar()">
        <i class="material-icons">add</i>
      </div>
    </div>
    <div class = "calendarBox" >
      <div class = "calendar">
        <div class = "dayColumn times">
          <div class = "timeTop">8</div>
          <div class = "hour time">9</div>
          <div class = "hour time">10</div>
          <div class = "hour time">11</div>
          <div class = "hour time">12</div>
          <div class = "hour time">1</div>
          <div class = "hour time">2</div>
          <div class = "hour time">3</div>
          <div class = "hour time">4</div>
          <div class = "hour time">5</div>
          <div class = "hour time">6</div>
          <div class = "hour time">7</div>
          <div class = "hour time">8</div>
          <div class = "hour time">9</div>
          <div class = "hour time">10</div>
        </div>
        <div class = "dayColumn" v-for = "dayColumn in this.$options.dayColumnLabels" :key = "dayColumn.acronym">
          <div class = "dayLabel">{{ dayColumn.acronym }}</div>
          <div v-for = "n in 14" :key="n" class = "hour" :class = "{last: n==14}">
            <div v-for="classBlock in getClassBlocks(dayColumn.name, n+7)" v-on:click="removeOffering(classBlock.crn)"
            :key="classBlock.id" :style = "styleBlock(classBlock)" class = "classBlock">
              <p>
                {{ formatTime(classBlock.startTime) }}
              </p>
              <p>
                <b>{{ classBlock.crn }}</b>
              </p>
              <p>
                {{ classBlock.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'Calendar',
  scrollAmount: 150,
  dayColumnLabels: [
    {acronym: 'MON', name: 'monday'},
    {acronym: 'TUE', name: 'tuesday'},
    {acronym: 'WED', name: 'wednesday'},
    {acronym: 'THUR', name: 'thursday'},
    {acronym: 'FRI', name: 'friday'}
  ],
  computed: {
    currentCalendar: {
      get () {
        return this.$store.state.currentCalendar
      },
      set (index) {
        this.$store.commit('selectCalendar', index)
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWidth)
      this.getWidth()
    })
  },
  data () {
    return {
      editing: -1,
      calendarName: '',
      editingNew: false,
      showArrows: false
    }
  },
  methods: {
    getWidth () {
      this.showArrows = document.getElementById('tabs').scrollWidth !== document.getElementById('tabs').offsetWidth
    },
    commitEdit: function (index) {
      this.$store.commit('editCalendarName', {index: index, name: this.calendarName})
      this.editingNew = false
      this.cancelEdit(index)
    },
    cancelEdit: function (index) {
      this.editing = -1
      this.calendarName = ''
      if (this.editingNew) {
        this.editingNew = false
        this.$store.commit('deleteCalendar', index)
      }
    },
    editName: function (index) {
      this.editing = index
      Vue.nextTick(() => {
        this.$refs.edit[0].focus()
      })
    },
    deleteCalendar: function (index) {
      this.$store.commit('deleteCalendar', index)
      if (this.$store.state.calendars.length === 0) {
        this.addCalendar()
      }
    },
    addCalendar: function () {
      this.$store.commit('addCalendar')
      this.editingNew = true
      this.editName(this.$store.state.calendars.length - 1)
      setTimeout(() => { this.$refs.tabs.scrollLeft += 1000 }, 2)
    },
    scrollRight: function () {
      this.$refs.tabs.scrollLeft += this.$options.scrollAmount
    },
    scrollLeft: function () {
      this.$refs.tabs.scrollLeft -= this.$options.scrollAmount
    },
    formatTime: function (value) {
      return moment(String(value)).format('h:mm A')
    },
    removeOffering: function (crn) {
      this.$store.commit('removeOffering', crn)
    },
    getClassBlocks: function (day, hour) {
      var blocks = []
      const currentCalendar = this.$store.state.calendars[this.$store.state.currentCalendar]
      const offerings = currentCalendar.offerings[currentCalendar.history]
      offerings.forEach(offering => {
        offering.classBlocks.forEach(block => {
          if (block.day === day && block.startHour === hour) blocks.push(block)
        })
      })
      this.$store.state.hoveredOffering.classBlocks.forEach(block => {
        if (block.day === day && block.startHour === hour) blocks.push(block)
      })
      // for (i = 0; i < this.$store.state.hoveredOfferingBlocks.length; ++i) {
      //   if (day === this.$store.state.hoveredOfferingBlocks[i].day &&
      //     hour === this.$store.state.hoveredOfferingBlocks[i].startHour) {
      //     blocks.push(this.$store.state.hoveredOfferingBlocks[i])
      //   }
      // }
      return blocks
    },
    styleBlock: function (classBlock) {
      var style = {}
      style.color = '' + this.convertHex(classBlock.color, 0.7, 1)
      style.backgroundColor = '' + this.convertHex(classBlock.color, 1.2, 0.3)
      style.top = '' + classBlock.startMinuteOffset * 1.62 + '%'
      style.height = '' + classBlock.length * 1.72 + '%'
      style.borderLeft = '3px solid ' + classBlock.color
      return style
    },
    convertHex: function (hex, brightness, opacity) {
      hex = hex.replace('#', '')
      var brightnessAdjust = brightness
      var r = Math.round(parseInt(hex.substring(0, 2), 16) * brightnessAdjust)
      var g = Math.round(parseInt(hex.substring(2, 4), 16) * brightnessAdjust)
      var b = Math.round(parseInt(hex.substring(4, 6), 16) * brightnessAdjust)
      var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')'
      return result
    }
  }
}
</script>

<style scoped>

  p { margin:1px }

  .classBlock {
    border-radius: 3px;
    position: absolute;
    padding: 3px;
    width: 100%;
    word-wrap: break-word;
    font-size: 12px;
    color: var(--body);
    text-align: left;
    z-index: 30;
    line-height: 13px;
    overflow: hidden;
  }

  .calendarMain {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden
  }

  .header {
    background-color: var(--red);
    padding: 8px 15px 0px 15px;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: 55px;
    align-items: center;
    display: flex;
    /* justify-content: center; */
  }

  .headerTitle {
    color: white;
    padding-right: 15px;
    background-color: var(--red);
    z-index: 30;
  }

  .nav-tabs {
    scroll-behavior: smooth;
    color: white;
    display: flex;
    flex-wrap: nowrap;
    bottom: -4px;
    position: relative;
    overflow: hidden;
    border: none;
    /* padding-left: 20px; */
    /* width: 50%; */
    /* left: -90px; */
  }

  .selected {
    background-color: var(--light-gray);
    color: var(--body) !important
  }

  .nav-item {
    cursor: pointer;
    flex: 0 0 auto;
  }

  .nav-link {
    color: white;
    text-decoration: line-through;
    user-select: none;
  }

  .nav-link:hover {
      border:1px solid transparent;
      background-color: rgba(1,1,1,0.1)
  }

  .selected:hover {
      background-color: var(--light-gray);
  }

  .delete {
    padding-left: 10px;
    top: 3px;
    position: relative;
    font-size: 15px;
  }

  .cal-input {
    border: none;
    outline: none;
    background-color: transparent;
    width: 100px;
  }

  .edit-button {
    font-size: 16px;
  }

  .nav-button {
    color: white;
    position: relative;
    /* margin-left: 10px; */
    bottom: -6px;
    cursor: pointer;
    user-select: none;
  }

  .calendarBox {
    justify-content: center;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1 1 0;
    padding: 15px;
  }

  .calendar {
    background-color: white;
    box-shadow: 0px 2px 5px rgb(203, 203, 203);
    height: 100%;
    max-height: 1200px;
    min-height: 700px;
    width: 100%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 10px 5px 10px 5px;
    display: flex;
    flex-direction: row;
    padding-left: 7px;
    border-collapse: collapse;
  }

  .timesBox {
    width: 20px;
    display: flex;
    flex-direction: column;
  }

  .dayColumn {
    text-align: center;
    border-left: 1px solid var(--light-gray);
    flex: 1 1 0;
    font-size: 12px;
    display: flex;
    flex-direction: column;
  }

  .dayColumn.times {
    flex-basis: 15px;
    margin-right: 5px;
    flex-grow: 0;
    border: none;
  }

  .hour {
    border-top: 1px solid var(--light-gray);
    border-collapse: collapse;
    flex-grow: 1;
    font-size: 11px;
    position: relative;
  }

  .hour.last {
    border-bottom: 1px solid var(--light-gray);
  }

  .hour.time {
    border: none;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: relative;
    top: 7px;
  }

  .timeTop {
    height: 20px;
    font-size: 11px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: relative;
    top: 7px;
  }

  .dayLabel {
    height: 20px;
  }

  /* .material-icons {
    font-size: 20px;
    position: absolute;
    color: var(--light-gray);
    margin-left: -5px;
  } */

  .nohover:hover{
    border: none;
    cursor: pointer;
  }

  .hoverOffering {
    position: absolute;
    /* top:200; */
    height: 6.7%;
    background-color: red;
    width: 100%;
    border-radius: 5px;
    visibility: hidden;
  }

</style>
