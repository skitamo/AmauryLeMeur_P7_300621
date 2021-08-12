//Configuration des routes internes

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes:[
  {
    name: "home",
    path: "/",   
    component: () => import("@/views/Home.vue")
  },
  {
    name: "signup",
    path: "/signup",
    component: () => import("@/views/Signup.vue")
  },
  {
    name: "userFeed",
    path: "/userfeed",
    component: () => import("@/views/UserFeed.vue")
  },
  {
    name: "userProfil",
    path: "/userprofil/:id",
    component: () => import("@/views/UserProfil.vue")
  },
  {
    name: "userConnectedProfil",
    path: "/userconnectedprofil",
    component: () => import("@/views/UserConnectedProfil.vue")
  },
  {
    name: "article",
    path: "/article/:id",
    component: () => import("@/views/Article.vue")
  }
  ],
  mode: "history"
});
