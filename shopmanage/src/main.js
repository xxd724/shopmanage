import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
Vue.use(VueAxios, axios)
Vue.use (VueCookies)



Vue.config.productionTip = false

//自定义一个全局的请求基础静态文件路劲
Vue.prototype.staticUrl="http://127.0.0.1:10000"

//设置基础请求路径
axios.defaults.baseURL="http://127.0.0.1:10000"

//设置post请求头
axios.defaults.headers.post['Content-Type']="application/x-www-form-urlencoded"

//携带cookies
axios.defaults.withCredentials=true;

//添加axios请求拦截器，该方法会在请求之前触发
axios.interceptors.request.use(params=>{
  console.log("params==>",params);
  //对于post请求，需要将参数进行序列化
  if(params.method=='post'){
    //a=1&b=2&c=3……
    let str="";
    for(let key in params.data){
      console.log(key);
      str +=`${key}=${params.data[key]}&`
    }
    //去除参数最后的&
  //slice()方法支持负数，负数则是从右到左数起
  params.data = str.slice(0,-1);
  }
  return params;
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
