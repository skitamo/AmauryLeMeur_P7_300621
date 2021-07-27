/* Configuration des routes internes */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
	routes:[
	{
		name: "home",
		path: "/",
		components: () => import("@/views/Home.vue")
	},
	{
		name: "signUp",
		path: "/signup",
		components: () => import("@/views/SignUp.vue")
	},
	{
		name: "userFeed",
		path: "/userfeed",
		components: () => import("@/views/UserFeed.vue")
	},
	{
		name: "userProfile",
		path: "/userprofile/:id",
		components: () => import("@/views/UserProfile.vue")
	},
	{
		name: "userConnectedProfile",
		path: "/userconnectedprofile",
		components: () => import("@/views/UserConnectedProfile.vue")
	},
	{
		name: "post",
		path: "/post/:id",
		components: () => import("@/views/Post.vue")
	}
	],
	mode: "history"
});