<template>
  <div class="template">
  </div>
</template>

<script>
export default {
  name: 'Template',
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

h1,
h2 {
  font-weight: normal;
}

</style>
