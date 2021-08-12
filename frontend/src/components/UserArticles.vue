<!-- COMPONENT USERARTICLES - Affichage des posts dans le feed -->

<template>
    <div class="articles" :id="idArticle">
        <div class="article col-lg-8 col-12">
            <div class="articleHeader">      
                <router-link :to="{ name: 'userProfil', params: {id: idUser } }">
                    <div class="friendInfo" :id="idUser">
                        <slot name="articleUserPhotoProfil"></slot>
                        <slot name="articleUsername"></slot>
                    </div>
                </router-link>
                <div>
                   <div id="optionDelete" v-on:click="isHidden = !isHidden" v-if="roleUser == 'Administrateur' || idUser == idUserConnected"><i class="fas fa-ellipsis-h" ></i></div>
                   <div id="deleteArticle" v-if="!isHidden" v-on:click.prevent="sendDataDeleteArticle()">Supprimer ce post</div>
                </div>
            </div>
            <div class="articlePost">
                <slot name="articleText"></slot>
            </div>
            <div class="articleMedia">
                <slot name="articleMediaUrl"></slot>
            </div>
            <div class="dateCreation">
                <slot name="articleDateCreation"></slot>
            </div>
            <div class="articleFooter row">
                <div class="commentsLikes col-sm-6 col-12">
                    <router-link :to="{ name: 'article', params: {id: idArticle } }">
                        <span class="numberComment"><slot name="numberOfComments"></slot> commentaires</span>
                    </router-link>
                    <span class="numberLikes"><i class="fas fa-thumbs-up likeThumb"></i> <slot name="numberOfLikes"></slot></span>
                </div>
                <div class="col-sm-6 col-12 mt-3 mt-sm-1 text-center text-sm-right d-flex justify-content-around justify-content-sm-end">
                    <router-link :to="{ name: 'article', params: {id: idArticle } }">
                        <span class="linkComment"><i class="far fa-comment-alt"></i> Commenter</span>
                    </router-link>
                    <span class="likeArticleNo" v-if="isLiked == 0" v-on:click.prevent="sendDataLikeArticle()"><i class="far fa-thumbs-up"></i>J'aime</span>
                    <span class="likeArticleYes" v-else-if="isLiked != 0" v-on:click.prevent="sendDataLikeArticle()"><i class="fas fa-thumbs-up"></i>J'aime</span>                   
                </div>
            </div>      
        </div>
    </div>
</template>

<script>
export default {
    name: "UserArticles",
    props: ["idArticle", "idUser", "idUserConnected", "roleUser", "like", "isLiked"],
    data () {
        return {
            isHidden: true
        }
    },
    methods:{
        sendDataDeleteArticle() {
            this.$emit("article-delete", this.idArticle);
        },
        sendDataLikeArticle() {
            this.$emit("article-like", this.idArticle);
        }
    }
}
</script>

<style lang="scss">
@font-face {
  font-family: "Montserrat";
  src: url(../font/Montserrat-Regular.ttf);
}
.article{
    font-family: "Montserrat";
    margin: 5px 15px 25px 15px;
    background-color: white;
    box-shadow: 2px 2px 5px lightgrey;
    border-radius: 5px;
    padding: 12px;
    margin: auto;
    margin-bottom: 25px;
    & a{
        text-decoration: none;
        color: black;
    }
}
.articleHeader{
    display: flex;
    justify-content: space-between;
}
.articleMedia{
    & img{
    max-width: 100%; 
    max-height: 400px; 
    }
    & video{
    max-width: 100%; 
    max-height: 400px; 
    }
}
.articleFooter{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: solid 1px grey;
    padding-top: 10px;
    & a{
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
    }
    & span{
        padding: 10px;
    }
}
.friendInfo{
    display: inline-block;
    align-items: center;
    padding: 10px;
    margin-bottom: 15px;
    cursor: pointer;
    & .friendName{
        margin-left: 15px;
        align-items: center;
    }
}
.dateCreation{
  font-size: 0.7em;
  color: grey;
  text-align: right;
}
#optionDelete{
    cursor: pointer;
}
#deleteArticle{
    position: absolute;
    right: 40px;
    top: 10px;
    padding: 5px;
    background-color: white;
    border: 1px solid black;
    font-size: 0.8em;
    cursor: pointer;
}
.commentsLikes{
    color: grey;
    font-size: 0.9em;
    & a {
        color: grey;
        font-size: 0.9em;
    }
}
.likeThumb{
    background: radial-gradient(#6d94c9, #204e8a);
    border-radius: 50%;
    padding: 5px;
    font-size: 0.65em;
    color: white;
}
.likeArticleNo{
    cursor: pointer;
}
.likeArticleYes{
    cursor: pointer;
    color: #204e8a;
}
</style>