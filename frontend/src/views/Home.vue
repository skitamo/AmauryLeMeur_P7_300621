<template>
  <div class="home">
    <Alert
      :alertType="alert.type"
      :alertMessage="alert.message"
    />
    <div class="groupo d-none d-md-flex">
      <img class="logo" alt="Groupomania logo" src="@/assets/icon-left-font-monochrome-white.png" height="250px" width="250px">
    </div>
    <LoginForm v-on:login-form="login"/>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';
import Alert from "@/components/Alert.vue";

export default {
  name: 'Home',
  components: {
    LoginForm,
    Alert
  },
  data: () => {
    return {
      email: "",
      password: "",
      alert:{
        type:"",
        message:""
      }
    };
  },
  
  methods: {
    login(payload){
      this.email = payload.email;
      this.password = payload.password;

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
    sessionStorage.removeItem("token");
    delete this.$axios.defaults.headers.common["Authorization"];
    document.title = "Connexion | Groupomania";
  }
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: "Montserrat";
  src: url(../font/Montserrat-SemiBold.ttf);
}
.home{
  display: flex;
  height: auto;
}
.groupo{
  width: 50%;
  min-height: 650px;
  background-image: url(../assets/back.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.logo{
  margin: auto;
  background-color: rgba(9,31,67,0.7);
  padding: 20px;
}
</style>
