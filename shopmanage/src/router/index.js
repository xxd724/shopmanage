import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const routes = [
  {
    path:"/register",
    name:"Register",
    component:()=>import("../views/Register.vue")
  },
  {
    path:"/login",
    name:"Login",
    component:()=>import("../views/Login.vue")
  },
  {
    path:"/main",
    name:"Main",
    component:()=>import("../views/Main.vue"),
    children:[
      {
        path:"type",
        name:"Type",
        component:()=>import("../views/Type.vue")
      }
    ]
  },
  {
    path:"/forgetpassword",
    name:"Forgetpassword",
    component:()=>import("../views/Forgetpassword.vue")
  }
]

const router = new VueRouter({
  routes
})


export default router
