<script setup>
    import {ref, onMounted, onBeforeUnmount} from 'vue'
    import { useAuthStore } from '@/stores/auth';
    import avatarNoneAssetURL from '@/assets/avatar-none.png'
    import { useRoute } from 'vue-router';

const openMenu = ref(false)
const showUserMenu = ref(false)

    const storeAuth = useAuthStore()

    const logout = () => {
      storeAuth.logout()
      openMenu.value = false;
      showUserMenu.value = false
    }

    const route = useRoute()


    const currentLinkStyle = "bg-gray-900 text-white"
    const defaultLinkStyle = "text-gray-300 hover:bg-gray-700 hover:text-white"



</script>

<template>
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button @click="openMenu = !openMenu" type="button"
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu" aria-expanded="false">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
            <svg :class="[openMenu ? 'hidden' : 'block', 'h-6', 'w-6']" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
            <svg :class="[openMenu ? 'block' : 'hidden', 'h-6', 'w-6']" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <svg class="block h-9 w-9" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 472.506 472.506" xml:space="preserve">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    d="M435.482,86.29L313.215,59.477v32.606l115.447,25.32c8.211,1.796,13.43,9.946,11.634,18.165l-61.713,281.395 c-0.879,3.981-3.251,7.394-6.673,9.587c-3.405,2.169-7.613,2.892-11.5,2.061l-94.864-20.809 c-4.945,1.252-10.038,2.115-15.365,2.115H126.512l227.07,49.799c3.305,0.731,6.695,1.097,10.086,1.097 c9.013,0,17.799-2.567,25.413-7.442c10.591-6.781,17.917-17.294,20.607-29.581l61.721-281.403 C476.969,117.015,460.849,91.843,435.482,86.29z">
                  </path>
                  <path
                    d="M344.943,270.34c3.405-15.506-6.409-30.833-21.906-34.239c-0.038-0.008-0.07-0.008-0.108-0.016 c4.098-3.833,7.13-8.896,8.43-14.79c3.11-14.2-4.9-28.119-18.143-33.002v53.756v50.5 C327.835,294.439,341.731,285.014,344.943,270.34z">
                  </path>
                  <path
                    d="M362.743,187.368c3.125,0.683,6.329-0.801,7.831-3.633l5.49-10.358l18.003,3.935l0.893,11.696 c0.249,3.273,2.621,6.003,5.832,6.711c2.317,0.505,4.728-0.118,6.517-1.68c1.78-1.556,2.714-3.873,2.512-6.237l-4.386-51.596 c-0.28-3.258-2.644-5.949-5.832-6.649l-7.901-1.734c-3.204-0.7-6.485,0.77-8.095,3.624l-25.569,45.438 c-1.112,1.975-1.22,4.362-0.287,6.431C358.676,185.377,360.526,186.885,362.743,187.368z M387.099,150.671 c1.827-3.423,3.801-7.963,5.552-11.51l0.186,0.047c0.116,3.951,0.21,8.865,0.513,12.831l0.995,14.199l-13.903-3.048 L387.099,150.671z">
                  </path>
                  <path
                    d="M297.289,346.884V58.801c0-25.973-21.137-47.109-47.109-47.109H47.109C21.135,11.692,0,32.828,0,58.801v288.083 c0,25.972,21.135,47.109,47.109,47.109H250.18C276.152,393.992,297.289,372.856,297.289,346.884z M31.852,346.884V58.801 c0-8.414,6.843-15.257,15.257-15.257H250.18c8.414,0,15.257,6.843,15.257,15.257v288.083c0,8.414-6.843,15.257-15.257,15.257 H47.109C38.695,362.141,31.852,355.297,31.852,346.884z">
                  </path>
                  <path
                    d="M172.44,182.119c-0.038,0-0.076,0.014-0.116,0.014c3.188-4.635,5.071-10.225,5.071-16.267 c0-15.888-12.87-28.75-28.742-28.75c-15.888,0-28.757,12.862-28.757,28.75c0,6.042,1.882,11.632,5.071,16.26 c-0.04,0-0.07-0.008-0.102-0.008c-15.886,0-28.756,12.87-28.756,28.748c0,15.88,12.87,28.742,28.756,28.742 c4.27,0,8.297-0.956,11.93-2.644c0.761-0.357,1.671-0.218,2.285,0.358c0.623,0.583,0.825,1.47,0.521,2.263l-8.352,21.836 c-0.623,1.617-0.404,3.429,0.575,4.859c0.981,1.424,2.605,2.279,4.332,2.279h24.97c1.734,0,3.351-0.855,4.332-2.279 c0.979-1.422,1.198-3.242,0.583-4.859l-8.368-21.844c-0.296-0.793-0.094-1.688,0.529-2.263c0.615-0.575,1.524-0.715,2.285-0.358 c3.633,1.688,7.668,2.652,11.952,2.652c15.872,0,28.742-12.862,28.742-28.742C201.181,194.988,188.311,182.119,172.44,182.119z M148.645,194.738c-0.032-0.054-0.078-0.084-0.108-0.132c0.038,0,0.076,0.008,0.116,0.008c0.03,0,0.07-0.008,0.1-0.008 C148.723,194.654,148.675,194.684,148.645,194.738z">
                  </path>
                  <path
                    d="M231.144,66.702c-0.965-3.118-3.849-5.249-7.124-5.249h-8.079c-3.282,0-6.174,2.139-7.132,5.28l-15.241,49.862 c-0.661,2.162-0.256,4.518,1.089,6.338c1.344,1.82,3.475,2.893,5.746,2.893c3.204,0,6.018-2.139,6.882-5.234l3.134-11.291h18.43 l3.375,11.214c0.949,3.157,3.849,5.311,7.14,5.311c2.371,0,4.596-1.128,6.003-3.033c1.4-1.905,1.82-4.37,1.121-6.633 L231.144,66.702z M212.519,98.414l3.819-13.655c1.049-3.725,2.007-8.593,2.962-12.419h0.186c0.957,3.826,2.109,8.601,3.25,12.419 l4.013,13.655H212.519z">
                  </path>
                  <path
                    d="M89.802,287.013c-0.965-3.118-3.849-5.249-7.124-5.249h-8.079c-3.282,0-6.174,2.139-7.132,5.28l-15.241,49.862 c-0.661,2.161-0.256,4.518,1.089,6.339c1.344,1.819,3.475,2.892,5.746,2.892c3.204,0,6.018-2.139,6.882-5.233l3.134-11.292h18.429 l3.375,11.214c0.949,3.156,3.849,5.311,7.14,5.311c2.371,0,4.596-1.128,6.003-3.032c1.4-1.906,1.82-4.372,1.121-6.633 L89.802,287.013z M71.176,318.725l3.819-13.655c1.049-3.725,2.007-8.594,2.962-12.419h0.186c0.957,3.825,2.109,8.6,3.251,12.419 l4.013,13.655H71.176z">
                  </path>
                </g>
              </g>
            </svg>
          </div>

          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <router-link :to="{name : 'Homepage'}" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'Homepage' ?  currentLinkStyle : defaultLinkStyle]">Home</router-link>
              <router-link :to="{name : 'SinglePlayer'}"  :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'Play' ?  currentLinkStyle : defaultLinkStyle]">Play</router-link>
              <router-link :to="{name : 'Statistics'}" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'Statistics' ?  currentLinkStyle : defaultLinkStyle]">Statistics</router-link>
              <router-link :to="{name : 'ScoreBoard'}" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'ScoreBoard' ?  currentLinkStyle : defaultLinkStyle]">Score Board</router-link>         
            </div>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <!-- Login Button in case of user being signed out -->
          <div v-if="!storeAuth.user" class="relative ml-3">
            <router-link class="text-white" :to="{name: 'PaginaLogin'}">
              Login
            </router-link>
          </div>
        <!-- As a player or admin  -->
         <div v-if="storeAuth.userType == 'P' || storeAuth.userType == 'A'"class="relative ml-3 flex space-x-4">
          <router-link :to="{name : 'GameHistory'}" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'GameHistory' ?  currentLinkStyle : defaultLinkStyle]">Game History</router-link>
         </div>

        <div v-if="storeAuth.userType == 'P'"
          class="relative ml-3 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!--- disable this to see the page as admir or user -->
          <span class="text-white">{{ storeAuth.brainCoinsBalance}}</span>
          <router-link :to="{name : 'Transactions'}" class="h-6 w-6 text-emerald-600">
            <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="12" cy="12" r="9" />
              <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
              <path d="M12 6v2m0 8v2" />
            </svg> 
          </router-link>
        </div>
        <!-- Profile dropdown in case of user being signed in -->
        <div v-if="storeAuth.user" class="relative ml-3">
          <div>
            <button @click="showUserMenu = !showUserMenu" type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" :src="storeAuth.user ? storeAuth.userPhotoUrl : avatarNoneAssetURL" alt="Rounded avatar">
            </button>


            <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
            >

            <div v-if="showUserMenu" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
              <!-- Active: "bg-gray-100", Not Active: "" -->
              <router-link class="block px-4 py-2 text-sm text-gray-700" :to="{name: 'Profile'}">Your Profile</router-link>
              <router-link :to="{name : 'TransactionsHistory'}" class="block px-4 py-2 text-sm text-gray-700">Transactions History</router-link>
              <button class="block px-4 py-2 text-sm text-gray-700" @click="logout">Logout</button>
            </div>
          </transition>
          </div>
        </div>

      </div>
      </div>
    </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <div v-if="openMenu" class="sm:hidden" id="mobile-menu">
    <div class="space-y-1 px-2 pb-3 pt-2">
      <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
      <router-link :to="{name : 'Homepage'}" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'Homepage' ?  currentLinkStyle : defaultLinkStyle]">Home</router-link>
      <router-link :to="{name : 'SinglePlayer'}"  :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'Play' ?  currentLinkStyle : defaultLinkStyle]">Play</router-link>
      <a href="#" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'Statistics' ?  currentLinkStyle : defaultLinkStyle]">Statistics</a>
      <router-link :to="{name : 'ScoreBoard'}" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'ScoreBoard' ?  currentLinkStyle : defaultLinkStyle]">Score Board</router-link>
      <!-- As a player or admin  -->
      <router-link v-if="storeAuth.user" :to="{name : 'GameHistory'}" :class="['block rounded-md px-3 py-2 text-base font-medium ',  route.name == 'GameHistory' ?  currentLinkStyle : defaultLinkStyle]">Game History</router-link>
         
    </div>
  </div>
</nav>

</template>
