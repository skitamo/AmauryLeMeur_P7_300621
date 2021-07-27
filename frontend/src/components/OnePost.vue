<!-- COMPONENT ONEPOST - Affichage d'un seul post -->

<template>
	
	<div class="posts" :id="idPost">
		<div class="post col-lg-8 col-12">
		
			<router-link :to="{ name: 'userProfile', params: { id: idUser } }">
				<div class="coworkerInfo" :id="idUser">
					<slot name="postUserProfilePicture"></slot>
					<slot name="postUsername"></slot>
				</div>
			</router-link>

			<div class="postContentText">
				<slot name="contentText"></slot>
			</div>

			<div class="postContentMedia">
				<slot name="contentMediaUrl"></slot>
			</div>

			<div class="dateCreation">
				<slot name="postDateCreation"></slot>
			</div>

		</div>
	</div>

</template>

<script>
	
	export default {
		name: "OnePost",
		props: ["idPost, idUser"]
	}

</script>

<style lang="scss">
	
	@font-face {
		font-family: "Montserrat";
		src: url(../font/Montserrat-Regular.ttf);
	}

	.post {
		font-family: "Montserrat";
		margin: 5px 15px 25px 15px;
		background-color: white;
		box-shadow: 2px 2px 5px lightgrey;
		border-radius: 5px;
		padding: 12px;
		margin: auto;
		margin-bottom: 5px;
	}

	.postContentMedia {
		& img {
			max-width: 100%;
			max-height: 400px;
		}
	}

	.coworkerInfo {
		display: inline-block;
		align-items: center;
		padding: 10px;
		margin-bottom: 15px;
		cursor: pointer;
		& .coworkerName {
			margin-left: 15px;
			align-items: center;
			color: black;
		}
	}

	.dateCreation {
		font-size: 0.7em;
		color: grey;
		text-align: right;
	}

</style>