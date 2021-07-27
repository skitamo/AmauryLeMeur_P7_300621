<!-- COMPONENT CREATEPOST - Formulaire pour créer le corps du post et sa photo/vidéo/gif -->

<template>
	
	<div id="createPost">
		<div class="createPost col-11 col-md-8">

			<span v-on:click="hideCreatePost()" class="cancelCreatePost">Annuler<i class="fas fa-times"></i></span>

			<div class="userInfos">
				<slot name="profilePicture"></slot>
				<slot name="username"></slot>
			</div>

			<form class="createPostForm" name="createPostForm">
				<div>
					<textarea v-model="text" class="postContentText" type="text" id="postContentText" name="text" placeholder="Ecrivez quelque chose..." />		
				</div>
				<div>
					<label class="postContentMedia" for="media">Ajoutez un média</label>
					<input type="file" name="media" id="media" class="media" v-on:change="sendFile($event)" />
				</div>
				<img id="preview">
				<input type="submit" v-on:click.prevent="sendDataCreatePost()" class="createPostButton" value="Publier !">
			</form>

		</div>
	</div>

</template>

<script>
	
	export default {
		name: "CreatePostForm",
		data: () => {
			return {
				text: "",
				media: ""
			};
		},

		methods: {
			hideCreatePost() {
				document.getElementById('createPost').style.display = 'none';
				document.getElementByName("text")[0].value = null;
				document.getElementByName("media")[0].value = null;
				document.getElementById('preview').removeAttribute("src");
			},
			sendFile(event) {
				this.$data.media = event.target.files[0];

				var file = document.getElementById("media").files;
				if (file.length > 0) {
					var fileReader = new FileReader();

					fileReader.onload = function (event) {
						document.getElementById("preview").setAttribute("src", event.target.result);
					};

					fileReader.readAsDataURL(file[0]);
				}
			},
			sendDataCreatePost() {
				this.$emit("post-sent", this.$data);
			}
		}
	};

</script>

<style lang="scss">
	
	@font-face {
		font-family: "Montserrat";
		src: url(../font/Montserrat-Regular.ttf);
	}

	#createPost {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
	}

	.createPost {
		display: flex;
		flex-direction: column;
		font-family: "Montserrat";
		background-color: white;
		box-shadow: 2px 2px 5px lightgrey;
		border-radius: 10px;
		margin: auto;
		position: fixed;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 20px;
		z-index: 99;
	}

	.media {
		opacity: 0;
	}

	.postContentMedia {
		color: white;
		background-color: rgb(32, 78, 138);
		border-radius: 10px;
		padding: 10px;
		cursor: pointer;
	}

	.postContentText {
		width: 100%;
		height: 150px;
	}

	.cancelCreatePost {
		display: flex;
		align-items: center;
		justify-content: end;
		cursor: pointer;
		& i {
			margin-left: 10px;
		}
		& :hover {
			color: lightgrey;
		}
	}

	.userInfos {
		margin-bottom: 15px;
	}

	.createPostButton {
		display: flex;
		font-size: 1.1em;
		color: white;
		background-color: rgb(9, 31, 67);
		border-radius: 20px;
		padding: 7px;
		text-align: center;
		border: rgb(255, 215, 215);
		cursor: pointer;
	}

	.createPostForm {
		display: flex;
		flex-direction: column;
	}

	#preview {
		max-height: 200px;
		max-width: 200px;
		margin-bottom: 10px;
	}

</style>