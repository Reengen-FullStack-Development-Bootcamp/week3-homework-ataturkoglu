<template>
  <v-container class="home d-flex flex-column justify-center m-0 p-0" fluid no-gutters>
    <!--<v-row class="d-flex flex-row justify-center align-center brdr">
      <v-col cols="4" class="mt-6">
      </v-col>
    </v-row>
    <v-row class="d-flex flex-row justify-center align-center">
    </v-row>-->
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
            <p>{{searchInput}}</p>
          </v-col>
        </v-row>
      </v-container>
    <v-container class="m-0 p-0 d-flex justify-center" fluid>
      <Chart/>
    </v-container>
  </v-container>
</template>

<script>
import Chart from "@/components/Chart.vue"
import {mapGetters} from "vuex"
export default {
  name: 'Home',
  components:{
    Chart
  },
  data(){
    return{
      searchInput:null,

    }
  },
  computed:{
    ...mapGetters(["getFoundCompanies"])
  },
  watch:{
    searchInput:{
      handler(val){
        console.log(val)
      }
    },

  },
  methods:{
    selectCompany(e){
      console.log(e)
      this.$store.commit("setSearchSymbol",e)
      this.$store.dispatch("getDailyData")
    },
    search(){
      console.log("name",this.searchInput)
      this.$store.commit("setSearchCompany",this.searchInput)
      this.$store.dispatch("getDatabyName")
    },
  }
}
</script>

<style scoped>
  .home{
    margin: 0;
    padding: 0;
    display: flex;
    align-items: start;
    justify-content: center;
    background-color: rgb(0, 0, 22);
  }
  .brdr{
    border: 1px solid red;
  }

  p{background-color: thistle;}
  
  svg{
      border: 1px solid blue;
      background-color: grey;
  }
</style>
