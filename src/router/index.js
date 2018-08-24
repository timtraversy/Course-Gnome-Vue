import Vue from 'vue'
import Router from 'vue-router'
import Schedule from '../components/Schedule'
import Requirements from '../components/Requirements'
import Social from '../components/Social'
import Advising from '../components/Advising'
import ChooseSchool from '../components/ChooseSchool'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/:school/schools', component: ChooseSchool },
    { path: '/:school/schedule', component: Schedule, name: 'Schedule' },
    { path: '/:school/requirements', component: Requirements },
    { path: '/:school/social', component: Social },
    { path: '/:school/advising', component: Advising }
  ]
})
