<template>
  <div class="asn">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank">
          Core Docs
        </a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank">
          Forum
        </a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank">
          Community Hat
        </a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank">
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a href="http://vuejs-templates.github.io/webpack/" target="_blank">
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2 v-bind:style="styleObj">Ecosystem</h2>
    <ul>
      <li>
        <a v-on:click="reverseMessage" target="_blank">
          vue-router
        </a>
      </li>
      <li v-if="seen">
        <a href="http://vuex.vuejs.org/" target="_blank">
          noscript
        </a>
      </li>
      <li v-else>
        <a href="http://vue-loader.vuejs.org/" target="_blank">
          vue-loader
        </a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank">
          awesome-vue and {{ input_val }}
        </a>
      </li>
    </ul>
    <div
       v-for="(item, index) in 10" v-bind:key="item.message">
        {{ index }} - {{ item.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      int: 1,
      input_val: '',
      seen: true,
      active: 'active',
      styleObj: {
        color: 'red',
        fontSize: '50px'
        // transform: 'rotate(10deg)'
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.active {
  color:green;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
  user-select:none;
}

a {
  color: #42b983;
}
</style>
