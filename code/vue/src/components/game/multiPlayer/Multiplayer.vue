<script setup>
import Lobby from '@/components/game/multiPlayer/Lobby.vue'
import Games from '@/components/game/multiPlayer/Games.vue'
import { useAuthStore } from '@/stores/auth'

const storeAuth = useAuthStore()
</script>
<template>
    <div class="flex flex-wrap justify-start space-x-4">
        <div v-if="storeAuth.userType == 'A'" class="text-center text-gray-600">
            <p>Looks like you are a Admin, Admins cannot play!</p>
        </div>
        <div v-if="storeAuth.userType == 'P'">

            <Lobby v-if="storeAuth.user" class="w-72"></Lobby>
            <Games v-if="storeAuth.user" class="flex-1 min-w-96"></Games>
        </div>
    </div>
</template>