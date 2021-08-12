<template>
  <div id="app">
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    Footer
  }
};
</script>

<style lang="scss">
#app{
  min-height: 100vh;
}
</style>
