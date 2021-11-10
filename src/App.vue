<template>
  <v-app id="app" no-gutters>
    <v-app-bar class="pr-7" app elevation="5" no-gutters fluid>
      <v-col cols="7" xs="2">
        <v-toolbar-title>ANE</v-toolbar-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="5" xs="9" class="d-flex align-center">
        <v-badge
          class="mr-5"
          color="blue"
          inline
          :content="$store.state.requests"
        >
          Requests
        </v-badge>
        <transition name="showSeconds">
          <v-badge
            v-if="$store.state.requests>=5||$store.state.waiting"
            class="seconds mr-5"
            color="blue"
            inline
            :content="count"
          >
            Seconds
          </v-badge>
        </transition>
        <v-btn v-if="$route.name=='Admin'" class="mr-5" small @click="toHomePage">
          Home Page
        </v-btn>
        <v-btn v-else class="mr-5" small @click="toAdminPage">
          Admin Page
        </v-btn>
        <v-select 
         color 
         v-model="user" 
         :items="items" 
         solo
         dense
         right
         height="100%"
         class="mt-6"
        >
        </v-select>
      </v-col>
    </v-app-bar>
    <v-main class="m-0 p-0" no-gutters>
      <v-container class="m-0 p-0" fluid no-gutters>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapState} from "vuex"
export default {
  name: 'App',
  data: () => ({
    user:"Guest",
    items:["Guest","Admin"],
    count:59,
    intrvl:null
  }),
  computed:{
    ...mapState(["requests","waiting"])
  },
  watch:{
    user:{
      handler(val){
        this.$store.state.user=val
      }
    },
    requests:{                                                    //request sayılarını session storage ile tutyoruz
      handler(val){                                               //dakikada 5 request hakkımız olduğu için 5. request sonrası timer çalıştırıyoruz
        if(val==5){
          sessionStorage.setItem("start",new Date().getTime())
          this.timer()
        }
      }
    },
    waiting:{                                                     //to many request hatası aldığımızda 1dk beklerken chart üzerinde 'waiting' yazısı gösteriyoruz
      handler(val){
        if(val){
          clearInterval(this.intrvl)
          this.count=59
          this.timer()
        }else{
          this.$store.dispatch("getChartData",this.$route.query.view)
        }
      }
    }
  },
  methods:{
    timer(){
      this.intrvl = setInterval(() => {
        this.count--
        if(this.count==0){
          clearInterval(this.intrvl)
          this.$store.state.requests=0
          sessionStorage.setItem("requests",0)
          this.count=59
          this.$store.state.waiting=false
        }
      }, 1000)
    },
    toAdminPage(){
      this.$router.push({name:"Admin"})
    },
    toHomePage(){
      this.$router.push({name:"Home"})
    }
  },

  created(){                                                                  //refresh durumunda timer ve request sayılarını session storage'ten alıyoruz
    if(sessionStorage.getItem("requests")!=null){
      this.$store.state.requests=sessionStorage.getItem("requests")
    }else{
      this.$store.state.requests="0"
    }
    sessionStorage.setItem("finish",new Date().getTime())
    let calc = Math.round((sessionStorage.getItem("finish")-sessionStorage.getItem("start"))/1000)
    if(calc<59){
      this.count-=calc
    }
  },

};
</script>

<style>
  #app{
    margin: 0;
    padding: 0;
  }
  .showSeconds-enter-active{
    animation: showsecs 1s ease-out;
  }
  .showSeconds-leave-active{
    animation: showsecs 1s ease-out reverse;
  }
  @keyframes showsecs{
    from{
      width: 0;
      opacity: 0;
    }
    to{
      opacity: 1;
      width: fit-content;
    }
  }
</style>
