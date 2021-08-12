<!-- COMPONENT CREATECOMMENT - Form pour créer un commentaire -->

<template>
  <div class="addComment col-lg-8 col-12">
      <slot name="photoProfil" class="col"></slot>
      <form class="createCommentForm col" name="createCommentForm">
          <textarea v-model="text" name="text" class="col" placeholder="Laissez un commentaire..." required/>
          <button v-on:click.prevent="sendDataCreateComment()" class="createCommentButton d-none d-sm-block" type="submit">Commenter</button>
          <button v-on:click.prevent="sendDataCreateComment()" class="createCommentButton d-sm-none p-3" type="submit"><i class="fas fa-paper-plane"></i></button>
      </form>
  </div>
</template>

<script>
export default {
  name: "CreateCommentForm",
  data: () => {
    return {
      text: ""
    };
  },
  methods: {
    sendDataCreateComment() {
        this.$emit("comment-sent", this.$data);
        document.getElementsByName("text")[0].value = null;
    },
  }
};
</script>

<style lang="scss">
.addComment{
    display: flex;
    font-family: "Montserrat";
    background-color: white;
    box-shadow: 2px 2px 5px lightgrey;
    border-radius: 5px;
    padding: 12px;
    margin: auto;
    margin-bottom: 25px;
    & form{
        display: flex;
        justify-content: space-between;
        & .createCommentButton{
          border: none;
          border-radius: 15px;
          padding: 5px 10px 5px 10px;
          margin-left: 15px;
          background-color: rgb(231,82,70);
          color: white;
          font-size: 0.95em;
        }
    }
    & textarea{
      border-radius: 15px;
      background-color: rgb(230, 230, 230);
      border: none;
      color: grey;
      &::placeholder {
        font-size: 0.8em;
      }
    }
}
</style>