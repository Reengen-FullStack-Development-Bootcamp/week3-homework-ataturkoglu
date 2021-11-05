import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'
import vuetify from './plugins/vuetify'
//import * as fs from 'fs'

Vue.config.productionTip = false

/*router.beforeEach((to,from,next)=>{
  let obj = new Object({
    date:new Date(),
    from:{
      path:from.fullPath,
      companySymbol:from.params.id,
      view:from.query.view
    },
    to:{
      path:to.fullPath,
      companySymbol:to.params.id,
      view:to.query.view
    },
    user:store.state.user
  })

  fs.writeFile("@/log.json",JSON.stringify(obj),(err)=>{
    if(err) console.log("dosya yazılamadı")
  })
  next()
})*/

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
