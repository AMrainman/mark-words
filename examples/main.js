import Vue from 'vue'
import App from './App.vue'
// import libs from '../packages'

// Vue.use(libs)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
