import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../components/Welcome'
import Schedule from '../components/Schedule'
import Requirements from '../components/Requirements'
import Social from '../components/Social'
import Advising from '../components/Advising'
import Console from '../components/Console'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/:school',
      component: Console,
      children: [
        { path: 'schedule', component: Schedule, name: 'Schedule' },
        { path: 'requirements', component: Requirements },
        { path: 'social', component: Social },
        { path: 'advising', component: Advising },
        { path: '/', redirect: '/:school/schedule' }
      ]
    },
    { path: '', component: Welcome },
    { path: '*', redirect: '/' }
  ]
})
