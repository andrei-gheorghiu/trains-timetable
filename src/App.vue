<script lang="ts">
import { defineComponent } from "vue";
import TrainsTimetable from "@/components/TrainsTimetable.vue";
export default defineComponent({
  name: "App",
  components: {
    TrainsTimetable,
  },
});
</script>

<template>
  <header />
  <main>
    <trains-timetable />
  </main>
  <footer />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
