// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'material-design-lite/material.min.css'
import 'material-design-lite/material.min.js'

Vue.config.productionTip = false

window.webstrateUrl = 'https://demo.webstrates.net/'

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
