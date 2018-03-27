<template>
  <div class = "splitcontainer">
    <div v-if="$mq === 'sm' || $mq === 'xsm'" class="btn-group btn-group-toggle" :style="backgroundColor" data-toggle="buttons">
      <label v-on:click="goToSearch()" class="btn btn-secondary searchBtn active">
        <input type="radio" name="options" id="option1" autocomplete="off" checked> Search
      </label>
      <label v-on:click="goToCalendar()" class="btn btn-secondary calendarBtn">
        <input type="radio" name="options" id="option2" autocomplete="off"> Calendar
      </label>
    </div>
    <div class="splitscreen">
      <Search v-if="atSearch || both"></Search>
      <Calendar v-if="atCalendar || both"></Calendar>
    </div>
  </div>
</template>

<script>
import Search from '../components/Search'
import Calendar from '../components/Calendar'
export default {
  name: 'Schedule',
  components: {
    Search, Calendar
  },
  data () {
    return {
      atSearch: true,
      atCalendar: false,
      msg: 'Welcome to Your Vue.js App',
      obj: {
        color: 'red',
        fontSize: '50px'
      },
      items: [
        { message: 'Foo' },
        { message: 'Bar' }
      ],
      lightblue: 'var(--uilightblue)',
      red: 'var(--uired)'
    }
  },
  methods: {
    goToSearch: function () {
      this.atSearch = true
      this.atCalendar = false
    },
    goToCalendar: function () {
      this.atCalendar = true
      this.atSearch = false
    }
  },
  computed: {
    both: function () {
      if (this.$mq === 'sm' || this.$mq === 'xsm') {
        return false
      } else {
        return true
      }
    },
    backgroundColor: function () {
      if (this.atSearch) { return {backgroundColor: this.lightblue} }
      return {backgroundColor: this.red}
      // if (this.atSearch) return ('var(--uilightblue)')
    },
    textColor: function () {
      if (this.atSearch) { return {color: this.lightblue} }
      return {color: this.red}
    }
  }
}
</script>

<style scoped>

.splitcontainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* height: 100%; */
}

.splitscreen {
  flex-shrink: 0;
  flex-grow:1;
  display: flex;
  flex-direction: row;
  height: 100%;
}

.btn-group {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 12px 15px 5px 15px;
}

.btn-secondary {
  width: 100px;
  padding: 2px 15px 5px 15px;
  display: flex;
  align-content: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid white;
}

.btn.btn-secondary.active.searchBtn {
  background-color: white;
  border: 1px solid white;
  color: var(--uilightblue)
}

.btn.btn-secondary.active.calendarBtn {
  background-color: white;
  border: 1px solid white;
  color: var(--uired)
}

.btn.btn-secondary.active.calendarBtn.focus {
  box-shadow: none;
}

.white {
  color: white;
  font-size: 14px;
}

</style>
