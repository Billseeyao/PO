import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import AuditOrder from '@/components/auditOrder'
import FinishOrder from '@/components/finishOrder'
import Login from '@/login'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/',
    name: 'Login',
    component: Login
  }, {
    path: '/auditOrder',
    name: 'AuditOrder',
    component: AuditOrder
  }, {
    path: '/finishOrder',
    name: 'FinishOrder',
    component: FinishOrder
  }]
})
