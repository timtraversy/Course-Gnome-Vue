import Vue from 'vue'
import Router from 'vue-router'
import Splitscreen from '../components/Splitscreen'
import Search from '../components/Search'
import Calendar from '../components/Calendar'
import Requirements from '../components/Requirements'
import Advising from '../components/Advising'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', redirect: '/gwu/splitscreen' },
    { path: '/:school/splitscreen', component: Splitscreen, name: 'Splitscreen' },
    { path: '/:school/search', component: Search, name: 'Search' },
    { path: '/:school/calendar', component: Calendar },
    { path: '/:school/requirements', component: Requirements },
    { path: '/:school/advising', component: Advising }
  ]
})
