import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/katalog",
      name: "katalog",
      component: CatalogView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "auth.login",
      component: () => import("../views/authentication/LoginView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard.index",
      component: () => import("../views/dashboard/DashboardView.vue"),
    },
    {
      path: "/kasir",
      name: "dashboard.kasir",
      component: () => import("../views/dashboard/KasirView.vue"),
    },
    {
      path: "/kategori",
      name: "dashboard.kategori",
      component: () => import("../views/dashboard/KategoriView.vue"),
    },
    {
      path: "/produk",
      name: "dashboard.produk",
      component: () => import("../views/dashboard/ProdukView.vue"),
    },
    {
      path: "/customer",
      name: "dashboard.customer",
      component: () => import("../views/dashboard/CustomerView.vue"),
    },
    {
      path: "/user",
      name: "dashboard.user",
      component: () => import("../views/dashboard/UserView.vue"),
    },
    {
      path: "/satuan",
      name: "dashboard.satuan",
      component: () => import("../views/dashboard/SatuanView.vue"),
    },
    {
      path: "/transaksi",
      name: "dashboard.transaksi",
      component: () => import("../views/dashboard/TransaksiView.vue"),
    },
    {
      path: "/stok",
      name: "dashboard.stok",
      component: () => import("../views/dashboard/StokView.vue"),
    },
    {
      path: "/supplier",
      name: "dashboard.supplier",
      component: () => import("../views/dashboard/SupplierView.vue"),
    },
    {
      path: "/laporan",
      name: "dashboard.laporan",
      component: () => import("../views/dashboard/LaporanView.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const cekLogin = authStore.isAuth;
  if (!cekLogin && to.name !== "auth.login") {
    return { name: "auth.login" };
  }
  if (cekLogin && to.name === "auth.login") {
    return { name: "dashboard.index" };
  }
});

export default router;
