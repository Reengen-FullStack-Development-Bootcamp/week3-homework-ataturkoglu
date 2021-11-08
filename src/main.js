import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

router.beforeEach((to,from,next)=>{
  let name=null
  if(store.state.user=="Admin"){
    name=`user:${store.state.user} - ${new Date().toUTCString()}`
  }else{
    name=`user:${store.state.user}${Math.floor(Math.random()*999+1)} - ${new Date().toUTCString()}`
  }
  let obj = new Object({
    id:store.state.log_count,
    name:name,
    state:"redirect",
    from:from.fullPath,
    to:to.fullPath
  })

  localStorage.setItem(`log${store.state.log_count}`,JSON.stringify(obj))
  store.state.log_count++

  next()
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
