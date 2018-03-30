<template>
  <div class="calendarMain">
    <div class = "header">
      <h1 v-if = "$mq != 'sm' && $mq != 'xsm'" class = "headerTitle">Calendar</h1>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link selected" href="#">My Schedule</a>
        </li>
        <!-- <li class="nav-item">
          <span class="nav-link nohover"><i class="material-icons">add_circle_outline</i></span>
        </li> -->
      </ul>
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
        <div class = "dayColumn">
          <div class = "dayLabel">MON</div>
          <div v-for = "n in 14" :key="n" class = "hour" :class = "{last: n==14}">
            <div v-for="classBlock in getClassBlocks('monday', n)" :key="classBlock.crn" :style = "styleBlock(classBlock)" class = "classBlock">
              Hello
            </div>
          </div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">TUE</div>
          <div v-for = "n in 14" :key="n" class = "hour" :class = "{last: n==14}">
            <div v-for="classBlock in getClassBlocks('tuesday', n)" :key="classBlock.crn" :style = "styleBlock(classBlock)" class = "classBlock">
              Hello
            </div>
          </div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">WED</div>
          <div v-for = "n in 14" :key="n" class = "hour" :class = "{last: n==14}">
            <div v-for="classBlock in getClassBlocks('wednesday', n)" :key="classBlock.crn" :style = "styleBlock(classBlock)" class = "classBlock">
              Hello
            </div>
          </div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">THUR</div>
          <div v-for = "n in 14" :key="n" class = "hour" :class = "{last: n==14}">
            <div v-for="classBlock in getClassBlocks('thursday', n)" :key="classBlock.crn" :style = "styleBlock(classBlock)" class = "classBlock">
              Hello
            </div>
          </div>
        </div>
        <div class = "dayColumn">
          <div class = "dayLabel">FRI</div>
          <div v-for = "n in 14" :key="n" class = "hour" :class = "{last: n==14}">
            <div v-for="classBlock in getClassBlocks('friday', n)" :key="classBlock.crn" :style = "styleBlock(classBlock)" class = "classBlock">
              Hello
            </div>
          </div>
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
    }
  },
  methods: {
    getClassBlocks: function (day, hour) {
      var blocks = []
      for (var i = 0; i < this.$store.state.classBlocks.length; ++i) {
        if (day === this.$store.state.classBlocks[i].day &&
          hour === this.$store.state.classBlocks[i].startHour) {
          console.log('hi')
          blocks.push(this.$store.state.classBlocks[i])
        }
      }
    },
    styleBlock: function (classBlock) {
      console.log('2')
      var style = {}
      style.backgroundColor = '' + classBlock.color
      style.top = '' + classBlock.startMinuteOffset + 'px'
      style.height = '' + classBlock.length + 'px'
      return style
    }
  }
}
</script>

<style scoped>

  .classBlock {
    border-radius: 3px;
    position: absolute;
    padding: 3px;
  }

  .calendarMain {
    flex-grow: 1;
    flex-basis: 0;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
  }

  .header {
    background-color: var(--red);
    padding: 8px 15px 0px 15px;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 60px;
    align-items: center;
    display: flex;
    /* justify-content: center; */
  }

  .headerTitle {
    color: white;
    padding-right: 20px;
  }

  .nav-tabs {
    margin-top: auto;
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
    flex: 1 1 0;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    position: relative;
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
