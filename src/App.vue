<template>
  <v-app id="app" no-gutters>
    <v-app-bar app elevation="5" no-gutters fluid>
      <v-col cols="10">
        <v-toolbar-title>ANE</v-toolbar-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="d-flex align-center">
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
