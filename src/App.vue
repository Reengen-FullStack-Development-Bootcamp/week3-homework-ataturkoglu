<template>
  <v-app id="app" no-gutters>
    <Navigation />
    <v-main class="m-0 p-0" no-gutters>
      <v-container class="m-0 p-0" fluid no-gutters>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation.vue";
export default {
  components: {
    Navigation,
  },
  name: "App",
  data: () => ({}),
};
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}
.showSeconds-enter-active {
  animation: showsecs 1s ease-out;
}
.showSeconds-leave-active {
  animation: showsecs 1s ease-out reverse;
}
@keyframes showsecs {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
    width: fit-content;
  }
}
</style>
