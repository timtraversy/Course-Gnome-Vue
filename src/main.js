// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueMq from 'vue-mq'

import store from './store/store'

Vue.use(VueMq, {
  breakpoints: {
    xsm: 400,
    sm: 850,
    md: 1050,
    lg: Infinity
  }
})

Vue.config.productionTip = false

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
