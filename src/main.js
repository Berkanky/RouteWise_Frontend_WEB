import { createApp } from "vue";
import { createPinia } from "pinia";
import "./input.css";
import { registerSW } from "virtual:pwa-register";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from "./App.vue";
import router from "./router";

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL_PRODUCTION;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 8000;

registerSW();

var app = createApp(App);

var pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(pinia);
app.use(router);

app.mount("#app");