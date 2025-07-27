import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound.vue';

import { env } from '@/config/env';
const router = createRouter({
  history: createWebHistory(env.APP_BASE_PATH),
  routes: [
    {
      path: '/',
      name: 'Fe Asignment App',
      component: () => import('../views/Home.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
});

export default router;
