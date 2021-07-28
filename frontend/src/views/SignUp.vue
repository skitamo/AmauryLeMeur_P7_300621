<template>
	
	<div class="register">
		
		<Alert
			:alertType="alert.type"
			:alertMessage="alert.message"
		/>

		<div class="groupomania d-none d-md-flex">
			<img class="logoGroupomania" alt="Logo Groupomania" src="@/assets/icon-left-font.svg" width="250px" height="250px">
			<p>Créez un compte pour commencer à partager avec vos collègues !</p>
		</div>

		<SignUpForm v-on:signup-form="signUp"/>

	</div>

</template>

<script>
	/* @ is an alias to /src */

	import SignUpForm from '@components/SignUpForm.vue'
	import Alert from '@components/Alert.vue'

	export default {
		name: 'SignUp',
		components: {
			SignUpForm,
			Alert
		},

		data: () => {
			return {
				email: "",
				password: "",
				firstName: "",
				lastName: "",
				alert: {
					type: "",
					message: "",
				}
			};
		},

		methods: {
			signUp(payload) {
				this.firstName = payload.firstName;
				this.lastName = payload.lastName;
				this.email = payload.email;
				this.password = payload.password;

				this.$axios( {
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
						this.$axios.default.headers.common["Authorization"] = "Bearer" + response.data.token;
						this.$router.push("/userfeed");
					})
					.catch((error) => {
						if (error.response.status === 500) {
							this.alertActive("info" error.response.data.error);
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

	.register {
		display: flex;
	}

	.groupomania {
		display: flex;
		flex-direction: column;
		width: 50%;
		min-height: 650px;
	}

	.logoGroupomania {
		margin: auto;
		box-sizing: border-box;
	}

	p {
		font-family: "Montserrat";
		font-size: 1.5em;
		text-align: center;
		color: black;
		padding: 25px;
		position: relative;
		bottom: 90px;
	}

</style>