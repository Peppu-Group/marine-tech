import { createRouter, createWebHistory } from 'vue-router'
import supabase from '../supabase'
import store from '../store'

import HomeView from '../views/HomeView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
import DashboardView from '../views/DashboardView.vue'
import CrewView from '../views/CrewView.vue'
import CrewSingleView from '../views/CrewSingleView.vue'
import MaintenanceRoute from '../views/MaintenanceRoute.vue'
import CrewRoute from '../views/CrewRoute.vue'
import InventoryView from '../views/InventoryView.vue'
import VoyageView from '../views/VoyageView.vue'
import LoginView from '../views/LoginView.vue'
import RedirectView from '../views/RedirectView.vue'
import SubRedirect from '../views/SubRedirect.vue'
import NewReq from '../views/NewReq.vue'
import ManageCertifications from '../views/ManageCertifications.vue'
import LogView from '../views/LogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/app/maintenance/:id',
      name: 'maintenance',
      component: MaintenanceView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/dashboard/maintenance',
      name: 'maintenanceroute',
      component: MaintenanceRoute,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/dashboard/crew',
      name: 'crewroute',
      component: CrewRoute,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/requisition',
      name: 'newreq',
      component: NewReq,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/certifications/:id',
      name: 'certifications',
      component: ManageCertifications,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/crew',
      name: 'crew',
      component: CrewView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/inventory',
      name: 'inventory',
      component: InventoryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/voyage',
      name: 'voyage',
      component: VoyageView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/crew/:id',
      name: 'crewsingle',
      component: CrewSingleView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/activity-log',
      name: 'logview',
      component: LogView,
      meta: { requiresAuth: true }
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: RedirectView
    },
    {
      path: '/subredirect',
      name: 'subredirect',
      component: SubRedirect
    }
  ]
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const { data, error } = await supabase.auth.getUser();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!data?.user) {
      return next('/login');
    }

    // Load user profile from store if not present
    if (!store.getters['user/userProfile']) {
      await store.dispatch('user/fetchUserProfile');
    }

    const profile = store.getters['user/userProfile'];
    if (!profile) {
      return next('/login');
    }

    const allowedRoles = ['owner', 'captain'];
    const isAuthorizedRole = allowedRoles.includes(profile.role);

    // Restrict vessel-specific access
    if (to.params.id && isAuthorizedRole) {
      const vesselId = to.params.id;

      // Block captains from accessing vessels they don't own
      if (profile.role === 'captain' && vesselId !== profile.vessel) {
        await Swal.fire({
          title: "Route Protected!",
          text: `You are logged in as a ${profile.role}, and you don't have access to this vessel's information.`,
          icon: "warning",
          confirmButtonText: "OK"
        });

        return next(false); // Cancel navigation
      }
    }

    next(); // All checks passed
  } else {
    next(); // Route doesn't require auth
  }
});

export default router
