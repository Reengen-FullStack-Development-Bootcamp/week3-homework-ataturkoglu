<template>
  <v-container class="home d-flex flex-column justify-center m-0 p-0" fluid no-gutters>
     <v-container class="d-flex justify-center mt-6">
        <v-row class="d-flex justify-center">
          <v-col cols="4" class="d-flex align-center">
            <v-autocomplete 
             :search-input.sync="searchInput" 
             :items="getFoundCompanies==null?[]:getFoundCompanies"
             no-data-text="Waiting"
             :hide-no-data="getFoundCompanies==null"
             @change="selectCompany"
             solo dense
            ></v-autocomplete>
            <v-btn @click="search($event)" class="mb-6 ml-3" small>Search</v-btn>
          </v-col>
        </v-row>
      </v-container>
    <v-container class="m-0 p-0 d-flex justify-center align-center" style="width:fit-content">
      <transition name="slide">
        <router-view v-if="chart_state"></router-view>
      </transition>
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
      chart_state:this.$store.state.chartState
    }
  },
  computed:{
    ...mapGetters(["getFoundCompanies"])
  },
  methods:{
    selectCompany(e){
      console.log("searchCompany")
      this.$store.commit("setSearchSymbol",e)
      this.$router.push({name:"Chart",params:{id:e},query:{view:"daily"}})
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

  .slide-enter-active {
    animation: fromLeft 1s;
  }
  .fade-leave-active{
    animation-delay: .5s;
    animation: toRight 1s;
  }

  @keyframes fromLeft{
    from{
      transform: translateX(-200%);
      opacity: 0;
    }
    to{
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes toRight{
    from{
      transform: translateX(0);
      opacity: 1;
    }
    to{
      transform: translateX(200%);
      opacity: 1;
    }
  }
</style>
