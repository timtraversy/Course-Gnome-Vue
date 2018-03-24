<template>
  <div class = "splitcontainer">
    <div v-if="$mq === 'sm'" class="btn-group btn-group-toggle" data-toggle="buttons">
      <label v-on:click="goToSearch()" class="btn btn-secondary active">
        <input type="radio" name="options" id="option1" autocomplete="off" checked> Search
      </label>
      <label v-on:click="goToCalendar()" class="btn btn-secondary">
        <input type="radio" name="options" id="option2" autocomplete="off"> Calendar
      </label>
    </div>
    <div class="splitscreen">
      <Search v-if="atSearch || both"></Search>
      <Calendar v-if="atCalendar || both"></Calendar>
    </div>
  </div>
</template>

<div class="btn-group btn-group-toggle" data-toggle="buttons">
  <label v-on:click="goToSearch()" class="btn btn-secondary active">
    <input type="radio" name="options" id="option1" autocomplete="off" checked> Search
  </label>
  <label v-on:click="goToCalendar()" class="btn btn-secondary">
    <input type="radio" name="options" id="option2" autocomplete="off"> Calendar
  </label>
</div>

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
      ]
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
      if (this.$mq === 'sm') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>

.splitcontainer {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  padding: 15px 15px 5px 15px;
  background-color: var(--light-body);
}

.btn-secondary {
  width: 100px;
  padding: 5px 15px 10px 15px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.white {
  color: white;
  font-size: 14px;
}

</style>
