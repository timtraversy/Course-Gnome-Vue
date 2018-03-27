<template>
  <div class="calendarMain">
    <div class = "header">
      <h1 v-if = "$mq != 'sm' && $mq != 'xsm'" class = "headerTitle">Calendar</h1>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link selected" href="#">Active</a>
        </li>
        <li class="nav-item">
          <span class="nav-link nohover"><i class="material-icons">add_circle_outline</i></span>
        </li>
      </ul>
    </div>
    <div class = "calendarBox" >
      <!-- <div class = "calendarScrollable"> -->
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
        <div class = "dayColumn">
          <div class = "dayLabel">MON</div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour last"></div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">TUE</div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour last"></div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">WED</div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour last"></div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">THUR</div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour last"></div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">FRI</div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour"></div>
          <div class = "hour last"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data () {
    return {
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
    reverseMessage: function () {
      this.items.push({message: 'me'})
    }
  },
  computed: {
    reversedMessage: function () {
      return this.msg.split('').reverse().join('')
    }
  }
}
</script>

<style scoped>

.calendarMain {
  flex-grow: 1;
  flex-basis: 0;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--uired);
  padding: 8px 15px 0px 15px;
  flex-grow: 0;
  flex-shrink: 0;
}

.headerTitle {
  color: white
}

.calendarBox {
  justify-content: center;
  overflow: auto;
  flex: 1 1 0;
  padding: 15px;
}

.calendar {
  background-color: white;
  box-shadow: 0px 2px 5px rgb(203, 203, 203);
  height: 100%;
  max-height: 700px;
  min-height: 500px;
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
  flex-grow: 1;
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

.material-icons {
  font-size: 20px;
  position: absolute;
  color: var(--light-gray);
  margin-left: -5px;
}

.nohover:hover{
  border: none;
  cursor: pointer;
}

.selected {
  background-color: var(--light-gray);
  color: var(--body)
}

</style>
