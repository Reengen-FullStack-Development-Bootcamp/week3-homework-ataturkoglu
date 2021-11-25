<template>
  <v-app-bar elevation="5" no-gutters fluid class="head">
    <v-container fluid no-gutters class="fill-height p-0 m-0">
      <v-row
        class="d-flex justify-center p-0 m-0"
        fluid
        align-content="center"
        no-gutters
      >
        <v-col
          cols="5"
          md="4"
          lg="6"
          class="d-flex justify-start align-center p-0 m-0"
        >
          <v-app-bar-title
            class="p-0 m-0"
            :style="
              $vuetify.breakpoint.xs ? 'font-size:35px' : 'font-size:25px'
            "
            role="button"
            ><strong @click="toHomePage">ANE</strong></v-app-bar-title
          >
        </v-col>
        <v-col
          cols="7"
          md="4"
          lg="2"
          class="
            d-flex
            justify-end justify-sm-end justify-md-center
            align-center
          "
        >
          <v-badge
            class="mr-5"
            color="blue"
            inline
            :content="$store.state.requests"
            align-center
          >
            <small>Requests</small>
          </v-badge>
          <transition name="showSeconds">
            <v-badge
              v-if="$store.state.requests >= 5 || $store.state.waiting"
              class="seconds mr-5"
              color="blue"
              inline
              :content="count"
            >
              <small>Seconds</small>
            </v-badge>
          </transition>
        </v-col>
        <v-col cols="6" md="2" lg="1" class="d-flex justify-end align-center">
          <v-btn
            v-if="$route.name == 'Admin'"
            class="mr-5"
            small
            @click="toHomePage"
          >
            Home Page
          </v-btn>
          <v-btn v-else class="mr-5" small @click="toAdminPage">
            Admin Page
          </v-btn>
        </v-col>
        <v-col
          cols="6"
          md="2"
          lg="3"
          class="d-flex justify-center align-center"
        >
          <v-select
            color
            v-model="user"
            :items="items"
            solo
            dense
            right
            class="mt-6"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    user: "Guest",
    items: ["Guest", "Admin"],
    count: 59,
    intrvl: null,
  }),
  computed: {
    ...mapState(["requests", "waiting"]),
  },
  watch: {
    user: {
      handler(val) {
        this.$store.state.user = val;
      },
    },
    requests: {
      //request sayılarını session storage ile tutyoruz
      handler(val) {
        //dakikada 5 request hakkımız olduğu için 5. request sonrası timer çalıştırıyoruz
        if (val == 5) {
          sessionStorage.setItem("start", new Date().getTime());
          this.timer();
        }
      },
    },
    waiting: {
      //to many request hatası aldığımızda 1dk beklerken chart üzerinde 'waiting' yazısı gösteriyoruz
      handler(val) {
        if (val) {
          clearInterval(this.intrvl);
          this.count = 59;
          this.timer();
        } else {
          this.$store.dispatch("getChartData", this.$route.query.view);
        }
      },
    },
  },
  methods: {
    timer() {
      this.intrvl = setInterval(() => {
        this.count--;
        if (this.count == 0) {
          clearInterval(this.intrvl);
          this.$store.state.requests = 0;
          sessionStorage.setItem("requests", 0);
          this.count = 59;
          this.$store.state.waiting = false;
        }
      }, 1000);
    },
    toAdminPage() {
      this.$router.push({ name: "Admin" });
    },
    toHomePage() {
      this.$router.push({ name: "Home" });
    },
  },

  created() {
    //refresh durumunda timer ve request sayılarını session storage'ten alıyoruz
    if (sessionStorage.getItem("requests") != null) {
      this.$store.state.requests = sessionStorage.getItem("requests");
    } else {
      this.$store.state.requests = "0";
    }
    sessionStorage.setItem("finish", new Date().getTime());
    let calc = Math.round(
      (sessionStorage.getItem("finish") - sessionStorage.getItem("start")) /
        1000
    );
    if (calc < 59) {
      this.count -= calc;
    }
  },
};
</script>

<style>
.v-toolbar__content,
.head {
  height: fit-content !important;
}
.head{
  max-height: 13% !important;
}
.v-toolbar__content > .container {
  margin: 0 !important;
  padding: 0 !important;
  max-height: 20% !important;
}

@media screen and (max-width:960px) {
  .head{
    max-height: 20% !important;
  }
}
</style>
