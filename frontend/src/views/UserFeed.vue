<template>
  <div class="userFeed">
    <Header :idUserConnected="userConnected.userId">
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
      <div class="createArticleCard col-lg-8 col-12">
        <div class="createArticleTitle">
            <span>Partagez ce que vous voulez avec vos collègues !</span>
        </div>
        <div v-on:click="showCreateArticle()" class="createArticleLinks">
            <div class="userLink userPostPhoto col-4">
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

      <CreateArticleForm
        v-on:article-sent="createPost"
      >
        <template v-slot:photoProfil>
          <img :src="userConnected.photoProfil" id="userPhoto" class="userPhoto" alt="Photo de profil" />
        </template>
        <template v-slot:username>{{ userConnected.firstname }} {{ userConnected.lastname }}</template>
      </CreateArticleForm>

      <div class="noPost" v-if="articles.length==0">
        <span>Aucun post à afficher...</span>
      </div>

      <UserArticles
        v-for="article in articles" 
        :key="article.articleId" 
        :idArticle="article.articleId" 
        :idUser="article.userId"
        :idUserConnected="userConnected.userId"
        :roleUser="userConnected.role"
        :isLiked="article.isLiked"
        v-on:article-delete="deleteArticle"
        v-on:article-like="likeArticle"
      >
      <template v-slot:articleText>{{ article.text }}</template>

      <template v-slot:articleUserPhotoProfil>
        <img :src="article.photoProfil" class="userPhoto" alt="Photo de l'utilisateur" />
      </template>

      <template v-slot:articleMediaUrl v-if="article.mediaUrl != null && (article.mediaUrl.includes('.gif') || article.mediaUrl.includes('.jpg') || article.mediaUrl.includes('.png'))">
        <img :src="article.mediaUrl" class="articleMediaUrl" alt="Photo du post" />
      </template>

      <template v-slot:articleMediaUrl v-else-if="article.mediaUrl != null && (article.mediaUrl.includes('.mp4'))">
        <video width="100%" class="articleMediaUrl" alt="Vidéo du post" controls>
        <source :src="article.mediaUrl" type="video/mp4">
        Votre navigateur ne peut pas lire les vidéos HTML.
        </video>
      </template>

      <template v-slot:articleUsername>{{ article.firstname }} {{ article.lastname }}</template>

      <template v-slot:articleDateCreation>{{ article.dateCreation }}</template>

      <template v-slot:numberOfComments>{{ article.numberOfComments }}</template>

      <template v-slot:numberOfLikes>{{ article.numberOfLikes }}</template>
      
      </UserArticles>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import UserArticles from "@/components/UserArticles";
import CreateArticleForm from "@/components/CreateArticleForm";
import Alert from "@/components/Alert.vue";

// @ is an alias to /src
export default {
  name: 'UserFeed',
  components: {
    Header,
    UserArticles,
    CreateArticleForm,
    Alert
  },
  data: () => {
    return {
      articles: [],
      userConnected:{},
      alert:{
        type:"",
        message:""
      }
    }
  },
  methods: {
    getArticles() {
      this.$axios({
        method: 'get',
        url: 'http://localhost:3000/api/articles/'
      })
      .then((payload) => {
        this.articles = payload.data;
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
    createPost(payload) {

      const formData = new FormData();
      formData.append("text", payload.text);
      formData.append("image", payload.image);

      this.$axios({
        method: 'post',
        url: 'http://localhost:3000/api/articles/',
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then((result) => {
        this.alertActive("success", result.data.message);
        this.getArticles();
        this.hideCreateArticle();
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
    showCreateArticle(){
      document.getElementById('createArticle').style.display = 'block';
    },
    hideCreateArticle(){
      document.getElementById('createArticle').style.display = 'none';
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
    deleteArticle(payload){
      this.$axios({
            method: 'post',
            url: `http://localhost:3000/api/articles/${payload}`
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
    likeArticle(payload){
      this.$axios({
            method: 'post',
            url: `http://localhost:3000/api/articles/${payload}/like/`
      })
      .then(() => {
        this.getArticles();
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
    this.getArticles();
    this.getUserConnected();
    this.hideCreateArticle();
    document.title = "Mon fil d'actualité | Groupomania";
  }
  
}
</script>

<style scoped lang="scss">
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
.createArticleCard{
    display: flex;
    flex-direction: column;
    font-family: "Montserrat";
    background-color: white;
    box-shadow: 2px 2px 5px lightgrey;
    border-radius: 10px;
    margin: auto;
    margin-bottom: 20px;
}
.createArticleTitle{
    display: flex;
    justify-content: center;
    padding: 12px;
    text-align: center;
}
.createArticleLinks{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
.userLink{
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 12px;
    &:hover{
        box-shadow: 0px 0px 5px lightgrey;
    }
}
.userPostPhoto{
    & .fas{
        color: rgb(231,82,70);
        margin-right: 10px;
    }
}
.userPostPost{
    & .fas{
        color: rgb(32,78,138);
        margin-right: 10px;
    }
}
.userPostVideo{
    & .fas{
        color: rgb(248,244,60);
        margin-right: 10px;
    }
}
.noPost{
  margin: auto;
  padding: 150px 0px 150px 0px;
  font-size: 2em;
  color: grey;
  font-family: "Montserrat";
}
</style>