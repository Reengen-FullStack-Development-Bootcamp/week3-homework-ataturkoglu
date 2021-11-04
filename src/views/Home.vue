<template>
  <v-container class="home d-flex flex-column justify-center m-0 p-0" fluid no-gutters>
     <v-container class="d-flex justify-center mt-6">
        <v-row class="d-flex justify-center">
          <v-col cols="4" class="d-flex">
            <v-autocomplete 
             :search-input.sync="searchInput" 
             :items="getFoundCompanies==null?[]:getFoundCompanies"
             no-data-text="Waiting"
             :hide-no-data="getFoundCompanies==null"
             @change="selectCompany"
             solo dense
            ></v-autocomplete>
            <v-btn @click="search($event)" class="mt-1 ml-3" small>Search</v-btn>
          </v-col>
        </v-row>
      </v-container>
    <v-container class="m-0 p-0 d-flex justify-center align-center" style="width:fit-content">
      <router-view></router-view>
    </v-container>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex"
export default {
  name: 'Home',
  components:{
    
  },
  data(){
    return{
      searchInput:null,
    }
  },
  computed:{
    ...mapGetters(["getFoundCompanies"])
  },
  methods:{
    selectCompany(e){
      this.$router.push("/"+e)
      this.$store.commit("setSearchSymbol",e)
      this.$store.dispatch("getDailyData")
    },
    search(){
      console.log("name",this.searchInput)
      this.$store.commit("setSearchCompany",this.searchInput)
      this.$store.dispatch("getSymbolbyName")
    },
  }
}
</script>

<style>
  .home{
    margin: 0;
    padding: 0;
    display: flex;
    align-items: start;
    justify-content: center;
  }
  .brdr{
    border: 1px solid red;
  }
</style>
