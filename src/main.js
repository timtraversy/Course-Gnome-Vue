// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMq from 'vue-mq'
import store from './store/store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vuescroll from 'vue-scroll'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(vuescroll)
Vue.use(BootstrapVue)

Vue.use(VueMq, {
  breakpoints: {
    xsm: 413,
    sm: 850,
    md: 1050,
    lg: Infinity
  }
})

firebase.initializeApp({
  apiKey: 'AIzaSyCTZuYOceaRT-WL2wlS45L2tMOssLJzYbc',
  authDomain: 'course-gnome.firebaseapp.com',
  databaseURL: 'https://course-gnome.firebaseio.com',
  projectId: 'course-gnome',
  storageBucket: 'course-gnome.appspot.com',
  messagingSenderId: '545808437748'
})

export const db = firebase.firestore()

Vue.config.productionTip = false
var savedOfferings = JSON.parse(localStorage.getItem('savedOfferings'))
if (savedOfferings) {
  for (let i = 0; i < savedOfferings.length; ++i) {
    var docRef = db.collection('/schools/gwu/seasons/fall2018/offerings').doc(savedOfferings[i].id)
    docRef.get().then(function (offering) {
      if (offering.exists) {
        var newOffering = {}
        newOffering.id = offering.id
        newOffering.data = offering.data()
        newOffering.color = savedOfferings[i].color
        store.commit('addSavedOffering', newOffering)
      } else {
        console.log('No such document!')
      }
    }).catch(function (error) {
      console.log('Error getting document:', error)
    })
  }
}

export const flatui = {
  red: '#eb3b5a',
  orange: '#fa8231',
  gold: '#f7b731',
  green: '#20bf6b',
  turquoise: '#0fb9b1',
  lightblue: '#2d98da',
  darkblue: '#3867d6',
  purple: '#8854d0',
  gray: '#4b6584'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
