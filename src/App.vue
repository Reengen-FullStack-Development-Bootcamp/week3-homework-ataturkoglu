<template>
  <v-app id="app" no-gutters>
    <v-app-bar app elevation="5" no-gutters fluid>
      <v-col cols="9">
        <v-toolbar-title>ANE</v-toolbar-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3" class="d-flex align-center">
        <v-btn v-if="$route.name!='Admin'" class="mr-3" small @click="toAdminPage">
          Admin Page
        </v-btn>
        <v-btn v-if="$route.name!='Home'" class="mr-3" small @click="toHomePage">
          Home Page
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

export default {
  name: 'App',
  data: () => ({
    user:"Guest",
    items:["Guest","Admin"]
  }),
  watch:{
    user:{
      handler(val){
        this.$store.state.user=val
      }
    }
  },
  methods:{
    toAdminPage(){
      this.$router.push({name:"Admin"})
    },
    toHomePage(){
      this.$router.push({name:"Home"})
    }
  },

};
</script>

<style>
  #app{
    margin: 0;
    padding: 0;
  }
  .brdr{
    border:1px solid red
  }
</style>
