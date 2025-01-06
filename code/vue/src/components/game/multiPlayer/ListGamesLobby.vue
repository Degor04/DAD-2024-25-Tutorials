<script setup>
import { useAuthStore } from '@/stores/auth'
import { useLobbyStore } from '@/stores/lobby';

const storeAuth = useAuthStore()
const storeLobby = useLobbyStore()


</script>

<template>
    <div class="divide-y divide-solid divide-gray-200">
        <div v-for="game in storeLobby.games" :key="game.id" class="flex ps-2 pe-1">
            <div class="flex flex-col grow">
                <div class="text-base pe-4 grow leading-10 flex space-x-2">
                    <span class="pl-1">{{ storeAuth.getFirstLastName(game.player1.name) }}</span>
                </div>
                <span class="text-xs ps-1 pb-2 -mt-1 text-gray-500">
                    {{ new Date(game.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second:
                    "2-digit" }) }}</span>
            </div>
            <div class="py-1 flex items-center min-w-[1.9rem]">
                <button v-show="storeLobby.canRemoveGame(game)" type="button"
                    class="inline-block rounded bg-red-500 p-2 m-0.5 text-white"
                    @click="storeLobby.removeGame(game.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                        stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
                <button v-show="storeLobby.canJoinGame(game)" type="button"
                    class="rounded bg-cyan-500 p-2 m-0.5 text-white" @click="storeLobby.joinGame(game.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                        stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>