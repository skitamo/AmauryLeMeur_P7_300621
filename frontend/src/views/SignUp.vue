<template>
  <div class="register">
    <Alert
      :alertType="alert.type"
      :alertMessage="alert.message"
    />
    <div class="groupo d-none d-md-flex">
      <img class="logoGroupo" alt="Groupomania logo" src="@/assets/icon-left-font.png" height="250px" width="250px">
      <p>Créez un compte pour pouvoir partager avec vos collègues !</p>
    </div>
    <SignUpForm v-on:signup-form="signup"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SignUpForm from '../components/SignUpForm.vue';
import Alert from "@/components/Alert.vue";

export default {
  name: 'Signup',
  components: {
    SignUpForm,
    Alert
  },
  data: () => {
    return {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      alert:{
        type:"",
        message:""
      }
    };
  },
  methods: {
    signup(payload){
      this.firstname = payload.firstname;
      this.lastname = payload.lastname;
      this.email = payload.email;
      this.password = payload.password;

      this.$axios({
        method: 'post',
        url: 'http://localhost:3000/api/user/signup',
        data: this.$data
      })
      .then(() => {
          this.$axios({
            method: 'post',
            url: 'http://localhost:3000/api/user/login',
            data: this.$data
          })
          .then((response) => {
              sessionStorage.setItem("token", response.data.token);
              this.$axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
              this.$router.push("/userfeed");
          })
          .catch((error) => {
              if (error.response.status === 500) {
                this.alertActive("info", error.response.data.error);
              }
              if (error.response.status === 401) {
                this.alertActive("warning", error.response.data.error);
              }
          });
      })
      .catch((error) => {
          if (error.response.status === 500) {
            this.alertActive("info", error.response.data.error);
          }
          sessionStorage.removeItem("token");
      });
    },
    alertActive(type, message) {
      document.getElementById('alert').style.display = 'flex';

      const dataAlert = this.$data.alert;
      dataAlert.type = type;
      dataAlert.message = message;

      setTimeout(function () {
        document.getElementById('alert').style.display = 'none';
        dataAlert.type = "";
        dataAlert.message = "";
      }, 2000);
    }   
  },
  mounted() {
    document.title = "Inscription | Groupomania";
  }
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: "Montserrat";
  src: url(../font/Montserrat-SemiBold.ttf);
}
.register{
  display: flex;
}
.groupo{
  display:flex;
  flex-direction: column;
  width: 50%;
  min-height: 650px;
}
.logoGroupo{
  margin: auto;
  box-sizing: border-box;
}
p{
  font-family: "Montserrat";
  font-size: 1.5em;
  text-align: center;
  color: black;
  padding: 25px;
  position: relative;
  bottom: 90px;
}
</style>