<!-- COMPONENT FOOTER - Footer du site -->

<template>
  <footer>
    <div class="footer container-fluid">
      <div class="footerLinks row">
        <li class="col-md-2 col-lg-2">Conditions générales</li>
        <li class="col-md-2 col-lg-2">Contact</li>
        <li class="col-md-2 col-lg-2">A propos</li>
        <li class="col-md-2 col-lg-2">Services</li>
        <li class="col-md-2 col-lg-2">Aide</li>
        <li class="col-md-2 col-lg-2">Confidentialité</li>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style lang="scss">
footer{
  border-top: lightgrey 1px solid;
  height: auto;
}
.footer{
  text-align: center;
  padding: 10px;
  color: rgb(163, 163, 163);
  font-size: 0.9em;
  max-width: 1000px;
}
.footerLinks{
  & li{
    padding-top: 5px;
    padding-bottom: 5px;
    list-style-type: none;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
}
</style>