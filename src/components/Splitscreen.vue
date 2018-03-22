<template>
  <div class="splitscreen">
    <Search></Search>
    <Calendar></Calendar>
  </div>
</template>

<script>
import Search from '../components/Search'
import Calendar from '../components/Calendar'
export default {
  name: 'Splitscreen',
  components: {
    Search, Calendar
  },
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

.splitscreen {
  display: flex;
  flex-direction: row;
  height: 100%;
}

</style>
