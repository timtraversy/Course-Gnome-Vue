<template>
  <div class="main">
    <div class = "header">
      <h1 class = "headerTitle">Advising</h1>
    </div>
    <div class = "comingSoon">
      Coming soon!
    </div>
  </div>
</template>

<script>
export default {
  name: 'Advising',
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

.header {
  background-color: var(--red);
  padding: 8px 15px 0px 15px;
  align-items: center;
  display: flex;
  height: 60px;
}
.headerTitle {
  color: white;
  padding-right: 20px;
}

.comingSoon {
  margin-top: 15px;
  color: var(--body);
  font-size: 20px;
  margin-left: 15px;
}
</style>
