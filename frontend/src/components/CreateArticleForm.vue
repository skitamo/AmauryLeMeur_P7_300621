<!-- COMPONENT CREATEARTICLE - Form pour créer le corps du post et sa photo/vidéo/gif -->

<template>
    <div id="createArticle">
        <div class="createArticle col-11 col-md-8">
            <span v-on:click="hideCreateArticle()" class="annulCreateArticle">Annuler<i class="fas fa-times"></i></span>
            <div class="userInfos">
                <slot name="photoProfil"></slot>
                <slot name="username"></slot>
            </div>
            <form class="createArticleForm" name="createArticleForm">
                <div>
                    <textarea v-model="text" class="articleText" type="text" id="articleText" name="text" placeholder="Postez ce que vous voulez !"/>
                </div>
                <div>
                    <label class="articleSelectMedia" for="image">Choisir un fichier multimédia</label>
                    <input name="image" id="image" class="image" v-on:change="sendFile($event)" type="file"/>
                </div>
                <img id="preview">
                <input v-on:click.prevent="sendDataCreateArticle()" class="createArticleButton" type="submit" value="Publier !">
            </form>
        </div>
    </div>
</template>

<script>
export default {
  name: "CreateArticleForm",
  data: () => {
    return {
      text: "",
      image: ""
    };
  },
  methods: {
    hideCreateArticle(){
        document.getElementById('createArticle').style.display = 'none';
        document.getElementsByName("text")[0].value = null;
        document.getElementsByName("image")[0].value = null;
        document.getElementById("preview").removeAttribute("src");
    },
    sendFile(event) {
        this.$data.image = event.target.files[0];

        var file = document.getElementById("image").files;
        if (file.length > 0) {
            var fileReader = new FileReader();
 
            fileReader.onload = function (event) {
                document.getElementById("preview").setAttribute("src", event.target.result);
            };
 
            fileReader.readAsDataURL(file[0]);
        }
    },
    sendDataCreateArticle() {
        this.$emit("article-sent", this.$data);
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "Montserrat";
  src: url(../font/Montserrat-Regular.ttf);
}
#createArticle{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
}
.createArticle{
    display: flex;
    flex-direction: column;
    font-family: "Montserrat";
    background-color: white;
    box-shadow: 2px 2px 5px lightgrey;
    border-radius: 10px;
    margin: auto;
    position: fixed;
    top: 40%; left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    z-index: 99;
}
.image{
    opacity: 0;
}
.articleSelectMedia{
    color: white;
    background-color: rgb(32,78,138);
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
}
.articleText{
    width: 100%;
    height: 150px;
}
.annulCreateArticle{
    display: flex;
    align-items: center;
    justify-content: end;
    cursor: pointer;
    & i{
        margin-left: 10px;
    }
    &:hover{
      color: lightgrey;
    }
}
.userInfos{
    margin-bottom: 15px;
}
.createArticleButton{
    display: flex;
    font-size: 1.1em;
    color: white;
    background-color:rgb(9,31,67);
    border-radius: 20px;
    padding: 7px;
    text-align: center;
    border: rgb(255,215,215);
    cursor: pointer;
}
.createArticleForm{
    display: flex;
    flex-direction: column;
}
#preview{
    max-height:200px; 
    max-width:200px;
    margin-bottom: 10px;
}
</style>