import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Filter from "./filters";
import moment from "moment";
Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(moment);
// Vue.use(Filter);
const vm = new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
  store,
  Filter,
});
export { vm };
