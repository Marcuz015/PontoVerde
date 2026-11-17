import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { reveal } from "./directives/reveal";
import "@fontsource-variable/manrope";
import "./style.css";
import "./theme.css";
createApp(App).use(router).directive("reveal", reveal).mount("#app");
