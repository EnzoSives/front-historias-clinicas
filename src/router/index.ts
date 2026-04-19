import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/authStore';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Global auth guard:
  // - Require auth for all routes except login (and register)
  // - If already authenticated and trying to access login/register, redirect to home
  // - Role-based: 'turnero' can only access /turnos and /pacientes
  Router.beforeEach((to) => {
    const auth = useAuthStore();

    // Try to restore session if not already loaded
    if (!auth.isAuthenticated) {
      auth.restoreFromStorage();
    }

    const publicPaths = new Set(['/login', '/register']);

    if (!publicPaths.has(to.path) && !auth.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } };
    }

    if (publicPaths.has(to.path) && auth.isAuthenticated) {
      return auth.isTurnero ? { path: '/turnos' } : { path: '/dashboard' };
    }

    // Role guard for 'turnero'
    if (auth.isAuthenticated && auth.isTurnero) {
      const allowedForTurnero = new Set(['/turnos', '/pacientes']);
      if (!allowedForTurnero.has(to.path)) {
        return { path: '/turnos' };
      }
    }
  });

  return Router;
});
