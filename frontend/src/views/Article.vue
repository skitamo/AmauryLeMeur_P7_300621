<template>
  <div class="userFeed">
      <Header>
        <template v-slot:back>
          <i class="fas fa-times back" @click="$router.go(-1)"></i>
        </template>
        <template v-slot:photoProfil>
          <img :src="userConnected.photoProfil" id="userPhoto" class="userPhoto" alt="Photo de profil" />
        </template>
        <template v-slot:username>{{ userConnected.firstname }} {{ userConnected.lastname }}</template>
      </Header>

      <div class="feed">

        <Alert
          :alertType="alert.type"
          :alertMessage="alert.message"
        />

        <OneArticle 
            :key="article.articleId" 
            :idArticle="article.articleId" 
            :idUser="article.userId"     
          >
          <template v-slot:articleText>{{ article.text }}</template>
          <template v-slot:articleUserPhotoProfil>
            <img :src="article.photoProfil" class="userPhoto" alt="Photo de l'utilisateur" />
          </template>
          <template v-slot:articleMediaUrl>
            <img :src="article.mediaUrl" class="articleMediaUrl" alt="Photo du post" />
          </template>
          <template v-slot:articleUsername>{{ article.firstname }} {{ article.lastname }}</template>
          <template v-slot:articleDateCreation>{{ article.dateCreation }}</template>
        </OneArticle>

        <CreateCommentForm
          v-on:comment-sent="createComment"
        >
        <template v-slot:photoProfil>
              <img :src="userConnected.photoProfil" class="userPhotoComment" alt="Photo de profil" />
        </template>
        </CreateCommentForm>

        <div class="noComment" v-if="comments.length==0">
          <span>Aucun commentaire ici...</span>
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
          <template v-slot:commentText>{{ comment.text }}</template>
          <template v-slot:commentUsername>{{ comment.firstname }} {{ comment.lastname }}</template>
          <template v-slot:commentUserPhotoProfil>
            <img :src="comment.photoProfil" class="userPhoto" alt="Photo de l'utilisateur" />
          </template>
          <template v-slot:commentDateCreation>{{ comment.dateCreation }}</template>
          <template v-slot:photoProfil>
              <img :src="userConnected.photoProfil" class="userPhotoComment" alt="Photo de profil" />
          </template>
        </Comment>
        
      </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import OneArticle from "@/components/OneArticle";
import Comment from "@/components/Comment";
import CreateCommentForm from "@/components/CreateCommentForm";
import Alert from "@/components/Alert.vue";

export default {
    name: 'Article',
    data: () => {
      return {
        article: {},
        userConnected:{},
        comments:[],
        alert:{
          type:"",
          message:""
        }
      }
    },
    components: {
        Header,
        OneArticle,
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
          if (this.userConnected.role=="Administrateur"){
            document.getElementById('userPhoto').style.border="solid 2px yellow";
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
      getArticle() {
        this.$axios({
            method: 'get',
            url: `http://localhost:3000/api/articles/${this.$route.params.id}`
        })
        .then((payload) => {
          this.article = payload.data[0];
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
          url: `http://localhost:3000/api/articles/${this.$route.params.id}/comments`
        })
        .then((payload) => {
          this.comments = payload.data;
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
      createComment(payload){
        this.$axios({
            method: 'post',
            url: `http://localhost:3000/api/articles/${this.$route.params.id}/comments/create`,
            data: payload
        })
        .then(() => {
          this.alertActive("success", "Commentaire crée avec succès !");
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
      deleteComment(payload){
        console.log(payload);
        this.$axios({
            method: 'post',
            url: `http://localhost:3000/api/articles/${payload}/comments/delete`
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
    },
    mounted() {
      this.getArticle();
      this.getComments();
      this.getUserConnected();
    }
}
</script>

<style>
.feed{
  display: flex;
  flex-direction: column;
  background-color: rgb(230, 230, 230);
  padding: 10px;
}
.userPhoto{
  width: 25px;
  height: 25px;
  border-radius: 20px;
  margin-right: 10px;
}
.userPhotoComment{
  width: 46px;
  height: 46px;
  border-radius: 23px;
  margin-right: 10px;
}
.noComment{
  margin: auto;
  padding: 30px 0px 30px 0px;
  font-size: 1.5em;
  color: grey;
  font-family: "Montserrat";
}
</style>