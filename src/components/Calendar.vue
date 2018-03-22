<template>
  <div class="main">
    <div class = "header">
      <h1 class = "headerTitle">Calendar</h1>
    </div>
    <div class = "calendar">
      Hello
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

.main {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--light-body);
  padding: 8px 15px 5px 15px;
}

.headerTitle {
  color: white
}

.calendar {
  background-color: white;
  box-shadow: 0px 2px 5px rgb(203, 203, 203);
  height: 100%;
  margin: 20px;
  /* height: 50vh; */
}

</style>
