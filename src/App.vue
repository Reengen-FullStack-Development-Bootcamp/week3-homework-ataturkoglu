<template>
  <v-app id="app" no-gutters>
    <v-app-bar class="d-flex flex-row align-center" app elevation="5" no-gutters fluid>
      <v-col cols="10" class="d-flex justify-start" dense>
        <v-toolbar-title>ANE</v-toolbar-title>
      </v-col>
      <v-col cols="10" class="d-flex justify-right" dense>
        <v-select 
         color 
         v-model="user" 
         :items="items" 
         solo
         dense
         height=""
         right
         class="mt-6 ml-5"
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

  components: {
  },

  data: () => ({
    user:"Guest",
    items:["Guest","Admin"]
  }),

  created(){

  }
};
</script>

<style>
  #app{
    margin: 0;
    padding: 0;
  }
</style>
