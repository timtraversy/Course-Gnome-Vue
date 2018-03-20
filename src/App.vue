<template>
  <div id="app">
    <img src="./assets/logo.png">
    <HelloWorld></HelloWorld>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}

var config = {
  apiKey: 'AIzaSyCTZuYOceaRT-WL2wlS45L2tMOssLJzYbc',
  authDomain: 'course-gnome.firebaseapp.com',
  databaseURL: 'https://course-gnome.firebaseio.com',
  projectId: 'course-gnome',
  storageBucket: 'course-gnome.appspot.com',
  messagingSenderId: '545808437748'
}

firebase.initializeApp(config)
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
