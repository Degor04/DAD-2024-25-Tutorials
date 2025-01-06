import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SinglePlayer from '../components/game/singlePlayer/SinglePlayer.vue'
import MultiPlayer from '../components/game/multiPlayer/Multiplayer.vue'
//import SinglePlayer from '../views/SinglePlayer.vue'//do to merges
//import MultiPlayer from '../views/MultiPlayer.vue'
import RegistarConta from '../views/RegistarConta.vue'
import PaginaLogin from '../views/PaginaLogin.vue';
import GameHistory from '../views/GameHistory.vue';
import Play from '../views/Play.vue';
import ScoreBoard from '@/views/ScoreBoard.vue';
import Transactions from '../views/Transactions.vue';
import TransactionsHistory from '@/views/TransactionsHistory.vue';
import Profile from '@/views/Profile.vue';
import { useAuthStore } from '@/stores/auth';
import Statistics from '@/views/Statistics.vue';


import Admin from '@/views/Administracao.vue'
import Users from '@/components/Admin/Users.vue'


function isAuthenticated() {
    return !!localStorage.getItem('token')
  }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: HomePage,
    },
    {
      path: '/single-player',
      name: 'SinglePlayerPage',
      component: SinglePlayer
    },
    {
      path: '/multi-player',
      name: 'MultiPlayerPage',
      component: MultiPlayer,
      meta: { requiresAuth: true } 
    },
    {
      path: '/paginalogin',
      name: 'PaginaLogin',
      component: PaginaLogin
    },
    {
      path: '/gameHistory',
      name: 'GameHistory',
      component: GameHistory
    },
    {
      path: '/scoreBoard',
      name: 'ScoreBoard',
      component: ScoreBoard
    },
    {
      path: '/play',
      name: 'Play',
      component: Play,
      children: [
        {
          path: '/play', // Default child route (empty path)
          redirect: { name: 'SinglePlayer' }, // Redirect to SinglePlayer by default
        },
        {
          path: 'singleplayer',
          name: 'SinglePlayer',
          component: SinglePlayer, // Component for SinglePlayer
        },
        {
          path: 'multiplayer',
          name: 'MultiPlayer',
          component: MultiPlayer, // Component for MultiPlayer
          meta: { requiresAuth: true } 
        },
      ]
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions
    },
    
    {
      path: '/registarConta',
      name: 'RegistarConta',
      component: RegistarConta
    },
    {
      path: '/statistics',
      name: 'Statistics',
      component: Statistics
    },
    {
      path: '/transactionsHistory',
      name: 'TransactionsHistory',
      component: TransactionsHistory
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },

      {
        path: '/admin',
        name: 'Administracao',
        component: Admin,
        children: [
          {
            path: '/users',
            name: 'Users',
            component: Users,
          },
        ],
      }
  ]
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreToken()
  }
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Homepage' })
  } else {
    next()
  }
});

export default router