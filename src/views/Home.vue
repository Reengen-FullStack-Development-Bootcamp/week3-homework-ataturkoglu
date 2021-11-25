<template>
  <v-container
    class="home d-flex flex-column justify-center m-0 p-0 mb-5"
    fluid
    no-gutters
  >
    <v-container class="d-flex justify-center mt-3 mb-0" fluid>
      <v-row class="d-flex justify-center" fluid>
        <v-col xs="16" sm="7" md="5" lg="4" xl="3" class="d-flex align-center">
          <v-autocomplete
            ref="autocomplete"
            :search-input.sync="searchInput"
            :items="getFoundCompanies == null ? [] : getFoundCompanies"
            no-data-text="Waiting"
            :hide-no-data="getFoundCompanies == null"
            @change="selectCompany"
            solo
            dense
            progress
            class="my-0"
          ></v-autocomplete>
          <v-btn @click="search($event)" class="mb-6 ml-3" small>
            <v-progress-circular
              v-if="$store.state.buttonWaiting"
              indeterminate
              :size="20"
              color="primary"
              style="background:transparent"
            ></v-progress-circular>
            <span v-else>Search</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row fluid class="d-flex justify-center">
        <v-col xs="16" sm="14" md="12" lg="10" xl="8" no-gutters>
          <transition name="slide" mode="out-in">
            <v-card width="100%" class="chartCard rounded-xl flat" :key="$store.state.chart_key">
                <router-view></router-view>
            </v-card>
          </transition>
        </v-col>
      </v-row>
    </v-container>
    <transition name="disappear" mode="out-in">
      <Loader v-if="$store.state.loader" />
    </transition>
  </v-container>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: {
    Loader,
  },
  data() {
    return {
      searchInput: null,
    };
  },
  computed: {
    ...mapGetters(["getFoundCompanies","getData"]),
  },
  watch: {
    getFoundCompanies: {
      handler(val) {
        if (val != null || []) {
          this.$refs.autocomplete.isMenuActive = true; //veri değiştiğinde autocomplete menüsü açılması için
          this.$refs.autocomplete.focus(); //gelen veriyi takip ediyoruz
        }
      },
    },
  },
  methods: {
    selectCompany(e) {
      this.$store.commit("setSearchSymbol", e);
      this.$router.push({
        name: "Chart",
        params: { id: e },
        query: { view: "daily" },
      });
    },
    search() {
      this.$store.commit("setSearchCompany", this.searchInput);
      this.$store.dispatch("getSymbolbyName");
    },
  },
};
</script>

<style>
.home {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: start;
  justify-content: center;
}
.brdr {
  border: 1px solid red;
}

.fit-cont {
  width: fit-content;
  margin-block: 0;
  padding: 0;
}

.slide-enter-active {
  animation: fromLeft 1.5s ease-out;
}
.slide-leave-active {
  animation-delay: 0.5s;
  animation: toRight 1.5s ease-out;
}

@keyframes fromLeft {
  from {
    transform: translateX(-200%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes toRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(200%);
    opacity: 0;
  }
}

.disappear-enter-active,
.disappear-leave-active {
  transition: opacity 0.5s;
}
.disappear-enter,
.disappear-leave-to {
  opacity: 0;
}

.chartCard{
  border-radius: 20px;
  height: 30vw;
}

@media screen and (max-width:600px) {
  .chartCard{
    height: 75vw;
  }
}

@media screen and (min-width:600px) {
  .chartCard{
    height: 55vw;
  }
}

@media screen and (min-width:960px) {
  .chartCard{
    height: 45vw;
  }
}

@media screen and (min-width:1264px) {
  .chartCard{
    height: 35vw;
  }
}
</style>
