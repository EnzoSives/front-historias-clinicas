import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("src/components/LoginForm.vue"),
  },
  {
    path: "/register",
    component: () => import("src/components/RegisterForm.vue"),
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    // Todas las secciones principales apuntan al mismo componente → no hay remount al navegar
    path: "/:section(dashboard|pacientes|consultas|turnos|perfil)",
    component: () => import("pages/IndexPage.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
