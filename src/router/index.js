import Vue from 'vue'
import Router from 'vue-router'
import DrawingBoard from '@/components/DrawingBoard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DrawingBoard',
      component: DrawingBoard
    }
  ]
})
