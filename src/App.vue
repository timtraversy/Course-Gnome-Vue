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
//
// import { db } from './main'

// export var offeringsList = []

export default {
  name: 'App',
  components: {
    Navbar, Content
  },
  data () {
    return {
      offeringsList: []
    }
  },
  methods: {
    closeMobile: function () {
      this.$store.commit('closeMobile')
    }
  },
  watch: {
    offeringsList: function () {
      this.$store.commit('loadOfferings', this.offeringsList)
      // console.log(this.offeringsList[0].courseName)
    }
  },
  firestore () {
    // this.$store.commit('openMobile')
    return {
      // offeringsList: db.collection('coursesSpring2018')
    }
    // return {
    //   store.commit(db.collection('coursesSpring2018')
    // }
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
  z-index: 15;
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
