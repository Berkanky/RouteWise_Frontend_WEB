import { createApp } from "vue";
import { createPinia } from "pinia";
import "./input.css";
import { registerSW } from "virtual:pwa-register";

import App from "./App.vue";
import router from "./router";

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 8000;

registerSW();
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
