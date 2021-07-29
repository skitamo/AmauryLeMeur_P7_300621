<template>
	
	<div class="userFeed">
		
		<header :idUserConnected="userConnected.userId">
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
			<div class="createPostCard col-lg-8 col-12">
				<div class="createPostTitle">
					<span>Partagez ce que vous voulez avec vos collègues !</span>
				</div>
				<div v-on:click="showCreatePost()" class="createPostLinks">
					<div class="userLink userPostPicture col-4">
						<i class="fas fa-image"></i> Photo
					</div>
					<div class="userLink userPostPost col-4">
						<i class="fas fa-comment-dots"></i> Post
					</div>
					<div class="userLink userPostVideo col-4">
						<i class="fas fa-video"></i> Vidéo
					</div>
				</div>
			</div>

			<CreatePostForm v-on:post-sent="createPost">
				<template v-slot:profilePicture>
					<img :src="userConnected.profilePicture" id="userPicture" class="userPicture" alt="Photo de profil">
				</template>
				<template v-slot:userName>
					{{ userConnected.firstName }} {{ userConnected.lastName }}
				</template>
			</CreatePostForm>

			<div class="noPost" v-if="post.length == 0">
				<span>Aucun post à afficher...</span>
			</div>

			<UserPosts
				v-for="post in posts"
				:key="post.postId"
				:idPost="post.postId"
				:idUser="post.userId"
				:idUserConnected="userConnected.userId"
				:roleUser="userConnected.role"
				:isLiked="post.isLiked"
				v-on:post-delete="deletePost"
				v-on:post-like="likePost"
			>
				<template v-slot:postContentText>
					{{ post.contentText }}
				</template>
				<template v-slot:postUserProfilePicture>
					<img :src="post.profilePicture" class="userPicture" alt="Photo de profil">
				</template>
				<template v-slot:postContentMediaUrl v-if="post.contentMediaUrl != null && (post.contentMediaUrl.includes('gif') || post.contentMediaUrl.includes('jpg') || post.contentMediaUrl.includes('png') || post.contentMediaUrl.includes('svg'))">
					<img :src="post.contentMediaUrl" class="postContentMediaUrl" alt="Photo du post" />
				</template>
				<template v-slot:postContentMediaUrl v-else-if="post.contentMediaUrl != null && (post.contentMediaUrl.includes('mp4') || post.contentMediaUrl.includes('avi') || post.contentMediaUrl.includes('asf') || post.contentMediaUrl.includes('mkv') || post.contentMediaUrl.includes('mpeg'))">
					<video width="100%" class="postContentMediaUrl" alt="Vidéo du post" controls>
						<source :src="post.contentMediaUrl" type="video/mp4">
						<source :src="post.contentMediaUrl" type="video/avi">
						<source :src="post.contentMediaUrl" type="video/asf">
						<source :src="post.contentMediaUrl" type="video/mkv">
						<source :src="post.contentMediaUrl" type="video/mpeg">
						Votre navigateur ne peut pas lire les vidéos HTML.
					</video>
				</template>
				<template v-slot:postUserName>
					{{ post.firstName }} {{ post.lastName }}
				</template>
				<template v-slot:postDateCreation>
					{{ post.dateCreation }}
				</template>
				<template v-slot:numberOfComments>
					{{ post.numberOfComments }}
				</template>
				<template v-slot:numberOfLikes>
					{{ post.numberOfLikes }}
				</template>
			</UserPosts>

		</div>

	</div>

</template>

<script>
	/* @ is an allias to /src */
	import Header from "@/components/Header";
	import UserPosts from "@/components/UserPosts";
	import createPostFrom from "@/components/createPostForm";
	import Alert from "@/components/Alert";

	export default {
		name: 'UserFeed',
		components: {
			Header,
			UserPosts,
			createPostFrom,
			Alert
		},

		data: () => {
			return {
				posts: [],
				userConnected: {},
				alert: {
					type: "",
					message: ""
				}
			}
		},

		methods: {
			getPosts() {
				this.$axios({
					method: 'get',
					url: `http://localhost:3000/api/posts/`
				})
				.then((payload) => {
					this.posts = payload.data;
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

			getUserConnected() {
				this.$axios({
					method: 'get',
					url: `http://localhost:3000/api/user/`
				})
				.then((payload) => {
					this.userConnected = payload.data[0];
					if (this.userConnected.role == "Administrateur") {
						document.getElementById('userPicture').style.border = "solid 2px yellow";
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

			createPost(payload) {
				const formData = new FormData();
				formData.append("contentText", payload.contentText);
				formData.append("contentMedia", payload.contentMedia);
				this.$axios({
					method: 'post',
					url: `http://localhost:3000/api/posts/`,
					data: formData,
					headers: {
						"Content-Type": "multipart/form-data"
					}
				})
				.then((result) => {
					this.alertActive("success", result.data.message);
					this.getPosts();
					this.hideCreatePost();
				})
				.catch((error) => {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				})
			},

			showCreatePost() {
				document.getElementById('createPost').style.display = 'block';
			},

			hideCreatePost() {
				document.getElementById('createPost').style.display = 'none';
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
			},

			deletePost(payload) {
				this.$axios({
					method: 'post',
					url: `http://localhost:3000/api/posts/${payload}`
				})
				.then(() => {
					this.alertActive("success", "Post supprimé avec succès !");
					this.$router.go();
				})
				.catch((error) => {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				})
			},

			likePost(payload) {
				this.$axios({
					method: 'get',
					url: `http://localhost:3000/api/posts/${payload}/like/`
				})
				.then(() => {
					this.getPosts();
				})
				.catch((error) => {
					if (error.response.status === 500) {
						this.alertActive("info", error.response.data.error);
					}
					if (error.response.status === 401) {
						this.alertActive("warning", error.response.data.error);
					}
				})
			}
		},

		mounted() {
			this.getPosts();
			this.getUserConnected();
			this.hideCreatePost();
			document.title = "Mon fil d'actualité | Groupomania";
		}
	}

</script>

<style scoped lang="scss">
	
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

	.createPostCard {
		display: flex;
		flex-direction: column;
		font-family: "Montserrat";
		background-color: white;
		box-shadow: 2px 2px 5px lightgrey;
		border-radius: 10px;
		margin: auto;
		margin-bottom: 20px;
	}

	.createPostTitle {
		display: flex;
		justify-content: center;
		padding: 12px;
		text-align: center;
	}

	.createPostLinks {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	.userLink {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		padding: 12px;
		& :hover {
			box-shadow: 0px 0px 5px lightgrey;
		}
	}

	.userPostPicture {
		& .fas {
			color: rgb(231, 82, 70);
			margin-right: 10px;
		}
	}

	.userPostPost {
		& .fas {
			color: rgb(32, 78, 138);
			margin-right: 10px;
		}
	}

	.userPostVideo {
		& .fas {
			color: rgb(248, 244, 60);
			margin-right: 10px;
		}
	}

	.noPost {
		margin: auto;
		padding: 150px 0px 150px 0px;
		font-size: 2em;
		color: grey;
		font-family: "Montserrat";
	}

</style>