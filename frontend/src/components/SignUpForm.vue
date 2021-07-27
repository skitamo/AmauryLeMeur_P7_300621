<!-- COMPONENT SIGNUP - Formulaire pour se créer un compte -->

<template>
	
	<div class="form my-4 my-0-sm">
		
		<img class="logoSmall d-md-none" alt="Logo Groupomania" src="@/assets/icon-left-font-monochrome-black.svg">

		<p class="d-md-none">Créez un compte pour commencer à partager avec vos collègues !</p>

		<form id="signUpForm" name="signUpForm">
			<div>
				<input v-model="lastName" class="userName" type="text" id="lastName" name="lastName" placeholder="Nom" required>
			</div>
			<div>
				<input v-model="firstName" class="userName" type="text" id="firstName" name="firstname" placeholder="Prénom" required>
			</div>
			<div>
				<input v-model="email" type="text" id="email" name="email" placeholder="Adresse mail" required>
			</div>
			<div>
				<input v-model="password" type="password" id="password" name="password" placeholder="Mot de passe" required>
			</div>
			<div>
				<input v-on:click="sendDataSignUp()" class="signUpButton" type="button" value="Créer un compte">
			</div>
		</form>

	</div>

</template>

<script>
	
	export default {
		name: "CreateAccount",
		data: () => {
			return {
				firstName: "",
				lastName: "",
				password: "",
				email: "",
			};
		},

		methods: {
			sendDataSignUp() { /* Envois des données aux parents pour traiter l'envois à l'API */
				const emailValid = document.getElementById("email").checkValidity();
				const passwordValid = document.getElementById("password").checkValidity();
				const firstNameValid = document.getElementById("firstName").checkValidity();
				const lastNameValid = document.getElementById("lastName").checkValidity();

				if (emailValid && passwordValid && lastNameValid && firstNameValid) {
					this.$emit("signup-form", this.$data);
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

	.signUpButton {
		font-size: 1.2em;
		color: white;
		background-color: rgb(66, 183, 42);
		border-radius: 25px;
		padding-left: 40px;
		padding-right: 40px;
		border: rgb(255, 215, 215);
		margin-top: 50px;
		cursor: pointer;
	}

	p {
		color: black;
		padding-left: 10px;
		padding-right: 10px;
	}

	.signUpForm {
		width: 100%;
	}

	.logoSmall {
		width: 80%;
		margin-bottom: 50px;
	}

</style>