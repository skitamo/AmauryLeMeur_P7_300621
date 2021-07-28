<template>
	
	<div class="userProfile">
		
		<Alert
			:alertType="alert.type"
			:alertMessage="alert.message"
		/>

		<div class="headerProfile">
			<div class="backButton" @click="$router.go(-1)">
				<i class="fas fa-arrow-left"></i>
			</div>
			<img class="logoGroupomania" alt="Logo Groupomania" src="@/assets/icon-left-font-monochrome-black.svg">
		</div>

		<div class="profileInfos">
			<img :src="user.profilePicture" id="userPicture" class="userPicture" alt="Photo de profil" />
			<div class="userName">
				{{ user.firstName }} {{ user.lastName }}
			</div>
			<div>
				{{ user.role }}
			</div>
			<div class="userResume">
				{{ user.resume }}
			</div>
			<span>
				Contact : {{ user.email }}
			</span>
			<span class="userDateCreation">
				Inscrit depuis le {{ user.dateCreation }}
			</span>
			<button v-on:click="showUpdateForm()">Modifier mon profil</button>
		</div>

		<div id="updateProfile" class="updateProfile col-12 col-md-7">
			<div class="updateProfilePicture">
				<span>
					Modifier ma photo de profil
				</span>
				<input type="file" id="image" name="image/*" v-on:change="updateProfilePicture($event)" />
				<img id="preview">
			</div>
			<div class="updateProfileInfos">
				<span>
					Modifier les informations de mon profil
				</span>
				<input v-model="user.email" class="email" type="text" id="email" name="email" placeholder="Adresse mail" />
				<textarea v-model="user.resume" class="resume" type="text" id="resume" name="resume" placeholder="Parlez-nous un peu de vous..." />
			</div>
			<div class="updatePassword">
				<span>
					Modifier mon mot de passe
				</span>
				<input v-model="user.newPassword" type="password" id="newPassword" name="newPassword" placeholder="Nouveau mot de passe" />
			</div>
		</div>

		<div id="update" class="update col-7">
			<button v-on:click="showUpdateConfirm()">Confirmer les modifications</button>
		</div>

		<div id="confirmUpdateBack">
			<div id="confirmUpdate" class="confirmUpdate col-md-6 col-12">
				<div class="cancelUpdate">
					<span v-on:click="hideUpdateConfirm()">Annuler</span>
					<i class="fas fa-times"></i>
				</div>
				<div>
					<form>
						<input v-model="user.password" type="password" id="password" name="password" placeholder="Mot de passe" />
						<button v-n:click.prevent="updateUser()">Confirmer les modifications</button>
					</form>
				</div>
			</div>
		</div>

		<div id="delete" class="delete col-7">
			<button v-on:click="showDeleteConfirm()">Supprimer le compte</button>
		</div>
		
		<div id="confirmDeleteBack">
			<div id="confirmDelete" class="confirmDelete col-md-6 col-12">
				<div class="cancelDelete">
					<span v-on:click="hideDeleteConfirm()">Annuler</span>
					<i class="fas fa-times"></i>
				</div>
				<div class="confirmDeleteInfos">
					<span>Suppression de compte</span>
					<span>Attention cette action est irrévocable</span>
				</div>
				<div>
					<form>
						<input v-model="user.password" type="password" id="passwordDelete" name="passwordDelete" placeholder="Mot de passe">
						<button v-on:click.prevent="deleteUser()" type="submit">Supprimer le compte</button>
					</form>
				</div>
			</div>
		</div>

	</div>

</template>

<script>
	
	/* @ is an alias to /src */

	import Alert from "@/components/Alert.vue";

	export default {
		name: 'userConnectedProfile',
		components: {
			Alert
		},

		data: () => {
			return {
				user: {},
				alert: {
					type: "",
					message: "",
				}
			}
		},

		methods: {
			getUserConnected() {
				this.$axios( {
					method: 'get',
					url: `http://localhost:3000/api/user`
				})
				.then((payload) => {
					this.user = payload.data[0];
					if (this.user.role == "Administrateur") {
						document.getElementById('userPicture').style.border="solid 2px yellow";
					}
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			
			updateProfilePicture(event) {
				var file = document.getElementById("image").files;
				if (file.length > 0) {
					var fileReader = new FileReader();
					fileReader.onload = function (event) {
						document.getElementById("preview").setAttribute("src", event.target.result);
					};
					fileReader.readAsDataURL(file[0]);
				}
				const image=event.target.files[0];
				const formData = new FormData();
				formData.append("image", image);

				this.$axios({
					method: 'put',
					url: `http://localhost:3000/api/user/updateUser`,
					data: formData
				})
				.then(() => {
					this.getUserConnected();
				})
				.catch((error) => {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				});
			},

			updateUser() {
				const email = this.user.email;
				const resume = this.user.resume;
				const password = this.user.password;
				const newPassword = this.user.newPassword;
				let data;
				if (newPassword === "") {
					data = {
						email: email,
						resume: resume,
						password: password,
					};
				} else {
					data = {
						email: email,
						resume: resume,
						password: newPassword,
					};
				}
				this.$axios({
					method: 'put',
					url: `http://localhost:3000/api/user/updateUser`,
					data: data
				})
				.then((response) => {
					if (response.status === 200) {
						this.alertActive("success", "Modifications enregistrées !")
						this.$router.go();
					}
				})
				.catch((error) => {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				});
			},

			deleteUser() {
				const password = this.user.password;
				let data;
				data = {
					password: password
				};
				this.$axios({
					method: 'delete',
					url: `http://localhost:3000/api/user/deleteUser`,
					data: data
				})
				.then(() => {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				});
			},

			showUpdateForm() {
				document.getElementById('updateProfile').style.display = 'block';
				document.getElementById('update').style.display = 'flex';
			},

			hideUpdateForm() {
				document.getElementById('updateProfile').style.display = 'none';
				document.getElementById('update').style.display = 'none';
			},

			showDeleteConfirm() {
				document.getElementById('confirmDeleteBack').style.display = 'block';
				document.body.style.overflow = 'hidden';
			},

			hideDeleteConfirm() {
				document.getElementById('confirmDeleteBack').style.display = 'none';
				document.body.style.overflow = 'auto';
			},

			showUpdateConfirm() {
				document.getElementById('confirmUpdateBack').style.display = 'block';
				document.body.style.overflow = 'hidden';
			},

			hideUpdateConfirm() {
				document.getElementById('confirmUpdateBack').style.display = 'none';
				document.body.style.overflow = 'auto';
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
			this.hideUpdateForm();
			this.hideDeleteConfirm();
			this.hideUpdateConfirm();
			this.getUserConnected();
			document.title = "Mon profil | Groupomania";
		}
	}

</script>

<style scoped lang="scss">
	
	@font-face {
		font-family: "Montserrat";
		src: url(../font/Montserrat-Regular.ttf);
	}

	.register {
		width: 100%;
	}

	.userPicture {
		width: 140px;
		height: 140px;
		border-radius: 70px;
	}

	.userName {
		margin: 10px;
	}

	.userResume {
		margin: 10px;
		padding: 10px;
		border-top: lightgrey solid 1px;
		border-bottom: lightgrey solid 1px;
		max-width: 400px;
		text-align: center;
	}

	.userDateCreation {
		color: grey;
		font-size: 0.8em;
	}

	.profileInfos {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: "Montserrat";
		position: relative;
		z-index: 2;
		background: white;
		margin-top: 20px;
		& button {
			color: white;
			background-color: rgb(32, 78, 138);
			border-radius: 20px;
			border: none;
			padding: 5px 20px 5px 20px;
			margin: 20px;
		}
		& span {
			margin: 12px;
		}
	}

	.headerProfile {
		display: flex;
		justify-content: center;
		border-bottom: 1px solid lightgrey;
		padding: 10px;
	}

	.logoGroupomania {
		height: 40px;
	}

	.backButton {
		position: absolute;
		left: 20px;
		top: 10px;
		cursor: pointer;
		color: black;
		font-size: 1.5em;
	}

	.updateProfile {
		margin: auto;
		font-family: "Montserrat";
		justify-content: center;
		position: relative;
		z-index: 1;
		animation: fondu 900ms;
	}

	@keyframes fondu {
		0% {
			transform: translateY(-500px);
			opacity: 0;
		}
		100% {
			transform: translateY(0px);
			opacity: 1;
		}
	}

	.updateProfilePicture {
		display: flex;
		flex-direction: column;
		margin: auto;
		margin-bottom: 20px;
		align-items: center;
		& span {
			text-align: center;
			border-bottom: lightgrey solid 1px;
		}
		& input {
			margin: 10px;
		}
		& textarea {
			margin: 10px;
		}
	}

	.updateProfileInfos {
		display: flex;
		flex-direction: column;
		margin: auto;
		margin-bottom: 20px;
		& span {
        	text-align: center;
        	border-bottom: solid 1px lightgrey;
	    }
	    & input {
	        margin: 10px;
	    }
	    & textarea {
	        margin: 10px;
	    }
	}
	.updatePassword {
	    display: flex;
	    flex-direction: column;
	    margin: auto;
	    & span {
	        text-align: center;
	        border-bottom: solid 1px lightgrey;
	    }
	    & input {
	        margin: 10px;
	    }
	}
	.update {
	    display: flex;
	    justify-content: center;
	    border-top: solid 1px lightgrey;
	    margin: auto;
	    margin-top: 15px;
	    font-family: "Montserrat";
	    & button {
	      	color: white;
	      	background-color: rgb(32,78,138);
	      	border-radius: 20px;
	      	border: none;
	      	padding: 10px;
	      	margin: 20px;
	    }
	}
	#confirmUpdateBack {
	    width: 100%;
	    height: 100%;
	    background: rgba(0, 0, 0, 0.5);
	    position: fixed;
	    top: 0;
	    left: 0;
	    z-index: 99;
	}
	.confirmUpdate {
	    font-family: "Montserrat";
	    position: fixed;
	    top: 50%; left: 50%;
	    transform: translate(-50%, -50%);
	    z-index: 3;
	    text-align: center;
	    background-color: rgb(32,78,138);
	    padding: 80px;
	    border: solid 2px white;
	    border-radius: 20px; 
	    & button {
	      	color: white;
	      	background-color: rgb(32,78,138); 
	      	border: white 2px solid;
	      	border-radius: 10px;
	      	margin: 20px 20px 0px 20px;
	      	box-shadow: 1px 2px 5px black;
	    }
	    & input {
	      	margin-top: 15px;
	    }
	}
	.cancelUpdate {
	    display: flex;
	    justify-content: end;
	    align-items: center;
	    margin-top: -70px;
	    margin-right: -70px;
	    color: white;
	    cursor: pointer;
	    & span {
	      	margin-right: 10px;
	    }
	    & :hover {
	      	color: lightgrey;
	    }
	}
	.delete {
	    display: flex;
	    justify-content: center;
	    border-top: solid 1px lightgrey;
	    margin: auto;
	    margin-top: 15px;
	    font-family: "Overpass";
	    & button {
	      	color: white;
	      	background-color: rgb(231,82,70);
	      	border-radius: 10px;
	      	border: none;
	      	padding: 10px;
	      	font-weight: bold;
	      	margin: 20px;
	    }
	}
	#confirmDeleteBack {
	    width: 100%;
	    height: 100%;
	    background: rgba(0, 0, 0, 0.5);
	    position: fixed;
	    top: 0;
	    left: 0;
	    z-index: 99;
	}
	.confirmDelete {
	    font-family: "Montserrat";
	    position: fixed;
	    top: 50%; left: 50%;
	    transform: translate(-50%, -50%);
	    z-index: 9999;
	    text-align: center;
	    background-color: rgb(231,82,70);
	    padding: 80px;
	    border: solid 2px white;
	    border-radius: 20px;
	    & button {
	      	color: white;
	      	background-color: rgb(231,82,70); 
	      	border: white 2px solid;
	      	border-radius: 10px;
	      	margin: 20px;
	      	box-shadow: 1px 2px 5px black;
	    }
	}
	.confirmDeleteInfos {
	    display: flex;
	    flex-direction: column;
	}
	.cancelDelete {
	    display: flex;
	    justify-content: end;
	    align-items: center;
	    margin-top: -70px;
	    margin-right: -70px;
	    color: white;
	    cursor: pointer;
	    & span {
	    	margin-right: 10px;
	    }
	    & :hover {
	      	color: lightgrey;
	    }
	}
	#preview {
	    max-height:100px; 
	    max-width:100px;
	    margin-bottom: 10px;
	}

</style>