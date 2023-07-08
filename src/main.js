import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faRightToBracket,
  faAnglesRight,
  faAnglesLeft,
  faGaugeHigh,
  faCashRegister,
  faChartSimple,
  faBars,
  faSun,
  faMoon,
  faGear,
  faRightFromBracket,
  faUser,
  faUsers,
  faRightLeft,
  faTrashAlt,
  faXmark,
  faCheck,
  faLayerGroup,
  faPen,
  faMagnifyingGlass,
  faAngleRight,
  faAngleLeft,
  faWeightScale,
  faArrowUpShortWide,
  faArrowDownShortWide,
  faBox,
  faBoxesStacked,
  faExclamation,
  faTruck,
  faChartColumn,
  faEye,
  faPrint,
  faFileExcel,
  faBan,
  faMoneyBillTrendUp,
  faCoins,
  faArrowTrendUp,
  faArrowTrendDown,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(
  faRightToBracket,
  faAnglesRight,
  faAngleRight,
  faAnglesLeft,
  faAngleLeft,
  faGaugeHigh,
  faCashRegister,
  faChartSimple,
  faBars,
  faSun,
  faMoon,
  faBell,
  faGear,
  faRightFromBracket,
  faUser,
  faUsers,
  faRightLeft,
  faTrashAlt,
  faXmark,
  faCheck,
  faLayerGroup,
  faPen,
  faMagnifyingGlass,
  faWeightScale,
  faArrowUpShortWide,
  faArrowDownShortWide,
  faBox,
  faBoxesStacked,
  faExclamation,
  faTruck,
  faChartColumn,
  faEye,
  faPrint,
  faFileExcel,
  faBan,
  faMoneyBillTrendUp,
  faCoins,
  faArrowTrendUp,
  faArrowTrendDown,
  faEllipsis
);

// Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000/";

// Pinia
const pinia = createPinia();
// Pinia Persist
pinia.use((context) => {
  // Store ID that will be synced
  const storeId = context.store.$id;

  const serializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  };

  // Sync store from localStorage
  const fromStorage = serializer.deserialize(
    window.localStorage.getItem(storeId)
  );
  if (fromStorage) {
    context.store.$patch(fromStorage);
  }

  // Listen for changes and update localStorage
  context.store.$subscribe((mutation, state) => {
    window.localStorage.setItem(storeId, serializer.serialize(state));
  });
});

const app = createApp(App);

app.use(pinia);
app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
