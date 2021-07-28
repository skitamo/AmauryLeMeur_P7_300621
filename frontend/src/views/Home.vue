<template>
	
	<div class="home">
		
		<Alert
			:alertType="alert.type"
			:alertMessage="alert.message"
		/>

		<div class="groupomania d-none d-md-flex">
			<img class="logo" alt="Logo Groupomania" src="@/assets/icon-left-font-monochrome-black.svg" height="250px" width="250px">
		</div>

		<LoginForm v-on:login-form="login" />

	</div>

</template>

<script>
	
	import LoginForm from '../components/LoginForm.vue';
	import Alert from '../components/Alert.vue';

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
				alert: {
					type: "",
					message: ""
				}
			};
		},

		methods: {
			login(payload) {
				this.email = payload.email;
				this.password = payload.password;
				this.$axios( {
					method: 'post',
					url: 'http://localhost:3000/api/user/login',
					data: this.$data
				})
				.then((response) => {
					sessionStorage.setItem("token", response.data.token);
					this.$axios.default.headers.common["Authorization"] = "Bearer" + response.data.token;
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
				document.getElementById('alert').style.display
			}
		}
	}

</script>

<style scoped lang="scss">
	
	@font-face {
		font-family: "Montserrat";
		src: url(../font/Montserrat-SemiBold.ttf);
	}

	.home {
		display: flex;
		height: auto;
	}

	.groupomania {
		width: 50%;
		min-height: 650px;
		background-image: url(../assets/back.png);
		background-size: cover;
		background-repeat: no-repeat;
	}

	.logo {
		margin: auto;
		background-color: rgba(9, 31, 67, 0.7);
		padding: 20px;
	}

</style>