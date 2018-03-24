// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

import VueMq from 'vue-mq'

import store from './store/store'

Vue.use(VueMq, {
  breakpoints: {
    sm: 750,
    md: 1000,
    lg: Infinity
  }
})

Vue.config.productionTip = false

Vue.use(VueFire)
firebase.initializeApp({
  apiKey: 'AIzaSyCTZuYOceaRT-WL2wlS45L2tMOssLJzYbc',
  authDomain: 'course-gnome.firebaseapp.com',
  databaseURL: 'https://course-gnome.firebaseio.com',
  projectId: 'course-gnome',
  storageBucket: 'course-gnome.appspot.com',
  messagingSenderId: '545808437748'
})

export const db = firebase.firestore()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
