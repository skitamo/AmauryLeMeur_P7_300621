<!-- COMPONENT USERPOSTS - Affichage des posts dans le fil d'actualité -->

<template>
	
	<div class="posts" :id="idPost">
		<div class="post col-lg-8 col-12">
			
			<div class="postHeader">
				<router-link :to="{ name: 'userProfile', params: {id: idUser } }">
					<div class="coworkerInfo" :id="idUser">
						<slot name="postUserProfilePicture"></slot>
						<slot name="postUserName"></slot>
					</div>
				</router-link>
				<div>
					<div id="optionDelete" v-on:click="isHidden = !isHidden" v-if="roleUser == 'Administrateur' || idUser == idUserConnected"><i class="fas fa-ellipsis-h"></i></div>
					<div id="deletePost" v-if="!isHidden" v-on:click.prevent="sendDataDeletePost()">Supprimer ce post</div>
				</div>
			</div>

			<div class="postContentText">
				<slot name="contentText"></slot>
			</div>

			<div class="postContentMedia">
				<slot name="contentMediaUrl"></slot>
			</div>

			<div class="dateCreation">
				<slot name="postDateCreation"></slot>
			</div>

			<div class="postFooter row">
				<div class="commentsLikes col-sm-6 col-12">
					<router-link :to="{ name: 'post', params: { id: idPost } }">
						<span class="commentNumber"><slot name="numberOfComments"></slot>Commentaires</span>
					</router-link>
					<span class="likeNumber"><i class="fas fa-thumbs-up likeThumb"></i><slot name="numberOfLikes"></slot></span>
				</div>
				<div class="col-sm-6 col-12 mt-3 mt-sm-1 text-center text-sm-right d-flex justify-content-around justify-content-sm-end">
					<router-link :to="{ name: 'post', params: { id: idPost } }">
						<span class="linkComment"><i class="far fa-comment-alt"></i>Commenter</span>
					</router-link>
					<span class="likePostNo" v-if="isLiked == 0" v-on:click.prevent="sendDataLikePost()"><i class="far fa-thumbs-up"></i>J'aime</span>
					<span class="likePostYes" v-else-if="isLiked != 0" v-onclick.prevent="sendDataLikePost()"><i class="far fa-thumbs-up"></i>J'aime</span>
				</div>
			</div>
			

		</div>
	</div>

</template>

<script>
	
	export default {
		name: "UserPosts",
		props: ["idPost", "idUser", "idUserConnected", "roleUser", "like", "isLiked"],
		data () {
			return {
				isHidden: true
			}
		},

		methods: {
			sendDataDeletePost() {
				this.$emit("post-delete", this.idPost);
			},
			sendDataLikePost() {
				this.$emit("post-like", this.idPost);
			}
		}
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
		margin-bottom: 25px;
		& a {
			text-decoration: none;
			color: black;
		}
	}

	.postHeader {
		display: flex;
		justify-content: space-between;
	}

	.postContentMedia {
		& img {
			max-width: 100%;
			max-height: 400px;
		}
		& video {
			max-width: 100%;
			max-height: 400px;
		}
	}

	.postFooter {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: solid 1px grey;
		padding-top: 10px;
		& a {
			padding: 10px;
			border-radius: 10px;
			cursor: pointer;
		}
		& span {
			padding: 10px;
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
		}
	}

	.dateCreation {
		font-size: 0.7em;
		color: grey;
		text-align: right;
	}

	#optionDelete {
		cursor: pointer;
	}

	#deletePost {
		position: absolute;
		right: 40px;
		top: 10px;
		padding: 5px;
		background-color: white;
		border: 1px solid black;
		font-size: 0.8em;
		cursor: pointer;
	}

	.commentsLikes {
		color: grey;
		font-size: 0.9em;
		& a {
			color: grey;
			font-size: 0.9em;
		}
	}

	.likeThumb {
		background: radial-gradient(#6d94c9, #204e8a);
		border-radius: 50%;
		padding: 5px;
		font-size: 0.65em;
		color: white;
	}

	.likePostNo {
		cursor: pointer;
	}

	.likePostYes {
		cursor: pointer;
		color: #204e8a;
	}

</style>