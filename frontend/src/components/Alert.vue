<!-- COMPONENT ALERT - Messages d'alerte, d'erreur ou de confirmation -->

<template>
  <div id="alert" class="alert" :class="alertType" role="alert">{{ alertMessage }}</div>
</template>

<script>
export default {
  name: "Alert",
  props: ['alertType', 'alertMessage'],
};
</script>

<style lang="scss">
.alert{
  display: none;
  padding: 50px 150px 50px 150px;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  text-align: center;
}
.success{
  background-color: lightcyan;
  border: solid 2px green;
  color: green;
}
.warning{
  background-color: mistyrose;
  border: solid 2px red;
  color: red;
}
.info{
  background-color: lemonchiffon;
  border: solid 2px goldenrod;
  color: goldenrod;
}
</style>