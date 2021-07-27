<!-- COMPONENT LOGINFORM - Formulaire pour s'identifier -->

<template>
	
	<div class="form my-4 my-0-sm">
		
		<img class="logoSmall d-md-none" alt="Logo Groupomania" src="@/assets/icon-left-font-monochrome-black.svg">

		<form id="loginForm">
			<div>
				<input v-model="email" type="text" id="email" name="email" placeholder="Adresse mail" required>
			</div>
			<div>
				<input v-model="password" type="text" id="password" name="password" placeholder="Mot de passe" required>
			</div>
			<input v-on:click="sendDataLogin()" class="loginButton" type="button" value="Connexion">
		</form>

		<a href="">Mot de passe oublié ?</a>

		<router-link to="/signup" class="signUpButton">S'inscrire</router-link>

	</div>

</template>

<script>
	
	export default {
		name: "GoToRegister",
		data: () => {
			return {
				password: "",
				email: ""
			};
		},

		methods: {
			sendDataLogin() { /* Envois des données au parent pour traiter l'envois à l'API */
				const emailValid = document.getElementById("email").checkValidity();
				const passwordValid = document.getElementById("password").checkValidity();

				if (emailValid && passwordValid) {
					this.$emit("login-form", this.$data);
				} else {
					alert("Vérifiez les informations que vous avez renseigné")
				}
			}
		}
	}

</script>

<style scoped lang="scss">
	
	@font-face {
		font-family: "Montserrat";
		src: url(../font/Montserrat-SemiBold.ttf);
	}

	@font-face {
		font-family: "Montserrat-Light";
		src: url(../font/Montserat-Light.ttf);
	}

	.form {
		font-family: "Montserrat";
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		align-items: center;
		margin: auto;
	}

	input {
		font-size: 1.1em;
		margin-bottom: 20px;
		height: 40px;
		border-radius: 4px;
	}

	.loginButton {
		font-size: 1.1em;
		color: white;
		background-color: rgb(9, 31, 67);
		border-radius: 20px;
		padding-left: 20px;
		padding-right: 20px;
		border: rgb(255, 215, 215);
		margin: auto;
		cursor: pointer;
	}

	.signUpButton {
		font-size: 1.2em;
		color: white;
		background-color: rgb(66, 183, 42);
		border-radius: 12px;
		padding: 10px 30px 10px 30px;
		text-align: center;
		text-decoration: none;
		border: rgb(255, 215, 215);
		margin-right: auto;
		margin-left: auto;
		margin-top: 50px;
		cursor: pointer;
	}

	a {
		font-family: "Montserrat-Light";
		font-size: 0.8em;
		color: black;
		margin-top: 10px;
	}

	.logoSmall {
		width: 80%;
		margin-bottom: 50px;
	}

</style>