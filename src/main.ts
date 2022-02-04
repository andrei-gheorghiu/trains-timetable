import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import axios from "axios";
import VueAxios from "vue-axios";

import "@/style/app.scss";

const app = createApp(App);

app.use(VueAxios, axios);
app.use(createPinia());
app.mount("#app");
