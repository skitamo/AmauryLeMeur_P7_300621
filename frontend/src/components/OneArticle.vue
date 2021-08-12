<!-- COMPONENT ONEARTICLE - Affichage d'un seul post -->

<template>
    <div class="articles" :id="idArticle">
        <div class="article col-lg-8 col-12">
            <router-link :to="{ name: 'userProfil', params: {id: idUser } }">
                <div class="friendInfo" :id="idUser">
                    <slot name="articleUserPhotoProfil"></slot>
                    <slot name="articleUsername"></slot>
                </div>
            </router-link>
            <div class="articlePost">
                <slot name="articleText"></slot>
            </div>
            <div class="articleMedia">
                <slot name="articleMediaUrl"></slot>
            </div>
            <div class="dateCreation">
                <slot name="articleDateCreation"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "OneArticle",
    props: ["idArticle", "idUser"]
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
    margin-bottom: 5px;
}
.articleMedia{
    & img{
        max-width: 100%; 
        max-height: 400px; 
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
        color: black;
    }
}
.dateCreation{
  font-size: 0.7em;
  color: grey;
  text-align: right;
}
</style>