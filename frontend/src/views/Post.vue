<template>
	
	<div class="userFeed">
		
		<header>
			<template v-slot:back>
				<i class="fas fa-times back" @click="$router.go(-1)"></i>
			</template>
			<template v-slot:profilePicture>
				<img :src="userConnected.profilePicture" id="userPicture" class="userPicture" alt="Photo de profil" />
			</template>
			<template v-slot:userName>
				{{ userConnected.firstName }} {{ userConnected.lastName }}
			</template>
		</header>

		<div class="feed">
			
			<Alert
				:alertType="alert.type"
				:alertMessage="alert.message"
			/>

			<OnePost
				:key="post.postId"
				:idPost="post.postId"
				:idUser="post.userId"
			>
				<template v-slot:postContentText>
					{{ post.contentText }}
				</template>
				<template v-slot:postUserProfilePicture>
					<img :src="post.profilePicture" class="userPicture" alt="Photo de l'utilisateur" />
				</template>
				<template v-slot:postContentMediaUrl>
					<img :src="post.contentMediaUrl" class="postContentMediaUrl" alt="Photo du post" />
				</template>
				<template v-slot:postUserName>
					{{ post.firstName }} {{ post.lastName }}
				</template>
				<template v-slot:postDateCreation>
					{{ post.dateCreation }}
				</template>
			</OnePost>

			<CreateCommentForm
				v-on:comment-sent="createComment"
			>
				<template v-slot:profilePicture>
					<img :src="userConnected.profilePicture" class="userPictureComment" alt="Photo de profil" />
				</template>
			</CreateCommentForm>

			<div class="noComment" v-if="comments.length==0">
				<span>Aucun commentaire...</span>
			</div>

			<Comment
				v-for="comment in comments"
				:key="comment.commentId"
				:idComment="comment.commentId"
				:idUser="comment.userId"
				:idUserConnected="userConnected.userId"
				:roleUser="userConnected.role"
				v-on:comment-delete="deleteComment"
			>
				<template v-slot:commentContentText>
					{{ comment.contentText }}
				</template>
				<template v-slot:commentUserName>
					{{ comment.firstName}} {{ comment.lastName }}
				</template>
				<template v-slot:commentUserProfilePicture>
					<img :src="comment.profilePicture" class="userPicture" alt="Photo de l'utilisateur" />
				</template>
				<template v-slot:commentDateCreation">
					{{ comment.dateCreation }}
				</template>
				<template v-slot:profilePicture>
					<img :src="userConnected.profilePicture" class="userPictureComment" alt="Photo de profil" />
				</template>
			</Comment>

		</div>

	</div>

</template>

<script>
	
	import Header from "@/components/Header";
	import OnePost from "@/components/OnePost";
	import Comment from "@/components/Comment";
	import CreateCommentForm from "@/components/CreateCommentForm";
	import Alert from "@/components/Alert";

	export default {
		name: 'Article',
		data: () => {
			return {
				article: {},
				userConnected: {},
				comments: {},
				alert: {
					type: "",
					message: ""
				}
			}
		},

		components: {
			Header,
			OnePost,
			Comment,
			CreateCommentForm,
			Alert
		},

		methods: {
			
			getUserConnected() {
				this.$axios({
					method: 'get',
					url: `http://localhost:3000/api/user/`
				})
				.then((payload) => {
					this.userConnected = payload.data[0];
					if (this.userConnected.role == 'Administrateur') {
						document.getElementById('userPicture').style.border="solid 2px yellow";
					}
				})
				.catch(function (error) {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				});
			},
			getPost() {
				this.$axios({
					method: 'get',
					url: `http://localhost:3000/api/posts/${this.$route.params.id}`
				})
				.then((payload) => {
					this.post = payload.data[0];
				})
				.catch(function (error) {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
				});
			},
			getComments() {
				this.$axios({
					method: 'get',
					url: `http://localhost:3000/api/posts/${this.$route.params.id}/comments`
				})
				.then((payload) => {
					this.comments = payload.data[0];
				})
				.catch(function (error) {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				});
			},
			createComment(payload) {
				this.$axios({
					method: 'post',
					url: `http://localhost:3000/api/posts/${this.$route.params.id}/comments/create`
					data: payload
				})
				.then(() => {
					this.alertActive("success", "Commentaire publié avec succès !");
					this.getComments();
				})
				.catch(function (error) {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				});
			},
			deleteComment(payload) {
				console.log(payload);
				this.$axios({
					method: 'post',
					url: `http://localhost:3000/api/posts/${payload}/comments/delete`
				})
				.then(() => {
					this.alertActive("success", "Commentaire supprimé avec succès !");
					this.$router.go();
				})
				.catch(function (error) {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				});
			},
			alertActive(type, message) {
				document.getElementById('alert').style.display='flex';

				const dataAlert = this.$data.alert;
				dataAlert.type = type;
				dataAlert.message = message;

				setTimeout(function () {
					dataAlert.type = "",
					dataAlert.message = "",
				}, 2000);
			},
		},

		mounted() {
		this.getArticle();
		this.getComments();
		this.getUserConnected();
		}
	}

</script>

<style>
	
	.feed {
		display: flex;
		flex-direction: column;
		background-color: rgb(230, 230, 230);
		padding: 10px;
	}

	.userPicture {
		width: 25px;
		height: 25px;
		border-radius: 20px;
		margin-right: 10px;
	}

	.userPictureComment {
		width: 46px;
		height: 46px;
		border-radius: 23px;
		margin-right: 10px;
	}

	.noComment {
		margin: auto;
		padding: 30px 0px 30px 0px;
		font-size: 1.5em;
		color: grey;
		font-family: "Montserrat";
	}

</style>