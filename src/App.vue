<template>
  <div id="app">
    <div v-if = "this.$store.state.mobileNavOpen" v-on:click = "closeMobile()" class = "background">
    </div>
    <Navbar></Navbar>
    <Content></Content>
  </div>
</template>

<script>
import Content from './components/Content'
import Navbar from './components/Navbar'
import VueWorker from 'vue-worker'
import { pullCourses } from './networking/database.js'

export default {
  name: 'App',
  components: {
    Navbar, Content, VueWorker
  },
  data () {
    return {
    }
  },
  mounted () {
    pullCourses(this.$route.params.school, this.$store)
  },
  methods: {
    closeMobile: function () {
      this.$store.commit('closeMobile')
    }
  }
}

</script>

<style>
#app {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.background {
  z-index: 30;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.40);
  height: 100%;
  width: 100%;
}

html, body {
  height: 100%;
  overflow: hidden;
  font-family: 'Lato', sans-serif;
}
div {
  font-size: 14px;
}
h1 {
  font-weight: bold;
  font-size: 27px;
}
h2 {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 3px;
}
/* Lighter placeholder text */
*::-webkit-input-placeholder {
  color: var(--line)!important
}
*:-moz-placeholder {
  /* FF 4-18 */
  color: var(--line)!important
}
*::-moz-placeholder {
  /* FF 19+ */
  color: var(--line)!important
}
*:-ms-input-placeholder {
  /* IE 10+ */
  color: var(--line)!important
}
:root {
  --red: #cf000f;
  --dark-red: #960012;
  --unselected-link: rgba(255, 255, 255, 0.75);
  --light-gray: #edeff1;
  --body: #1b212a;
  --light-body: #282f3c;
  --lightest-body: #6F6F6F;
  --line: rgba(0, 0, 0, 0.13);

  --uired: #eb3b5a;
  --uiorange: #fa8231;
  --uigold: #f7b731;
  --uigreen: #20bf6b;
  --uiturquoise: #0fb9b1;
  --uilightblue: #2d98da;
  --uidarkblue: #3867d6;
  --uipurple: #8854d0;
  --uigray: #4b6584;
}
</style>
