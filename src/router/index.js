import Vue from 'vue'
import Router from 'vue-router'
import Schedule from '../components/Schedule'
import Requirements from '../components/Requirements'
import Social from '../components/Social'
import Advising from '../components/Advising'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', redirect: '/gwu/schedule' },
    { path: '/:school/schedule', component: Schedule, name: 'Schedule' },
    { path: '/:school/requirements', component: Requirements },
    { path: '/:school/social', component: Social },
    { path: '/:school/advising', component: Advising }
  ]
})
