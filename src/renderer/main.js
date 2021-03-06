import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import ToggleButton from 'vue-js-toggle-button';

import App from './App';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(ToggleButton);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
