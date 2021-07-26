<!-- COMPONENT COMMENT - Affichage des commentaires -->

<template>

	<div class="commentSection col-lg-8 col-12" :id="idComment">

		<div class="commentHeader">

			<router-link :to="{ name: 'userProfile', params: { id: idUser } }">
				<slot name="commentUserProfilePicture"></slot>
				<slot name="commentUsername"></slot>
			</router-link>

			<span v-if="roleUser == 'Administrateur' || idUser == idUserConnected" class="options"><i class="fas fa-times back" v-on:click.prevent="sendDataDeleteComment(idComment)"></i></span>
		
		</div>
		
		<div class="commentContentText">
			<slot name="commentContentText"></slot>
		</div>
		
		<div class="commentDateCreation">
			<slot name="commentDateCreation"></slot>
		</div>
	
	</div>

</template>

<script>

	export default {
		name: "Comment",
		props: ["idUser", "idUserConnected", "idComment", "roleUser"],
		data: () => {
			return {
				text: ""
			};
		},
		methods: {
			sendDataCreateComment() {
				this.$emit("comment-sent", this.$data);
			},
			sendDataDeleteComment(idComment) {
				this.$emit("comment-delete", idComment);
			}
		}
	};

</script>

<style lang="scss">

	.commentSection {
		display: flex;
		flex-direction: column;
		font-family: "Montserrat";
		margin: 5px 15px 25px 15px;
		background-color: white;
		box-shadow: 2px 2px 5px lightgrey;
		border-radius: 5px;
		padding: 12px;
		margin: auto;
		margin-bottom: 5px;
		& a {
			text-decoration: none;
			color: black;
		}
	}

	.commentHeader{
		display: flex;
		padding: 0px 0px 10px 10px;
		border-bottom: solid 1px lightgrey;
		justify-content: space-between;
		& .options {
			align-items: center;
			cursor: pointer;
		}
	}

	.comentText {
		padding: 15px;
	}

	.commentDateCreation {
		font-size: 0.7em;
		color: grey;
		text-align: end;
	}

</style>