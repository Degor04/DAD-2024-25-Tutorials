<script setup>
import { inject } from 'vue'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { computed } from 'vue'
import Board from '../Board.vue'
import { useAuthStore } from '@/stores/auth'
import { useGamesStore } from '@/stores/games'

const storeGames = useGamesStore()
const storeAuth = useAuthStore()

const props = defineProps({
    game: {
        type: Object,
        required: true
    }
})

const alertDialog = inject('alertDialog')

const opponentName = computed(() => {
    return storeGames.playerNumberOfCurrentUser(props.game) === 1 ?
        storeAuth.getFirstLastName(props.game.player2_name) :
        storeAuth.getFirstLastName(props.game.player1_name)
})

const gameEnded = computed(() => {
    return props.game.gameStatus > 0
})

const currentUserTurn = computed(() => {
    if (gameEnded.value) {
        return false
    }
    return props.game.currentPlayer === storeGames.playerNumberOfCurrentUser(props.game)
})

const cardBgColor = computed(() => {
    switch (props.game.gameStatus) {
        case null:
        case 0:
            return 'bg-white'
        case 1:
        case 2:
            return storeGames.playerNumberOfCurrentUser(props.game) == props.game.gameStatus ? 'bg-green-100' : 'bg-red-100'
        case 3:
            return 'bg-blue-100'
        default:
            return 'bg-slate-100'
    }
})

const statusMessageColor = computed(() => {
    switch (props.game.gameStatus) {
        case null:
        case 0:
            return currentUserTurn.value ? 'text-green-400' : 'text-slate-400'
        case 1:
        case 2:
            return storeGames.playerNumberOfCurrentUser(props.game) == props.game.gameStatus ? 'text-green-900' : 'text-red-900'
        case 3:
            return 'text-blue-900'
        default:
            return 'text-slate-800'
    }
})

const buttonClasses = computed(() => {
    if (gameEnded.value) {
        return 'bg-gray-700 text-gray-200 hover:text-gray-50'
    }
    return 'bg-gray-300 text-gray-700 hover:text-gray-200'
})

const statusGameMessage = computed(() => {
    switch (props.game.gameStatus) {
        case null:
        case 0:
            return currentUserTurn.value ? 'Your turn ' : 'Opponent turn '
        case 1:
        case 2:
            return storeGames.playerNumberOfCurrentUser(props.game) == props.game.gameStatus ? 'You won' : 'You lost'
        case 3:
            return 'Draw'
        default:
            return 'Not started!'
    }
})

const playPieceOfBoard = (idx) => {
    storeGames.play(props.game, idx)
}

const clickCardButton = () => {
    if (gameEnded.value) {
        close()
    } else {
        alertDialog.value.open(quit, 'Quit game', 'Cancel', `Yes, I want to quit`,
            `Are you sure you want to quit the game #${props.game.id}? You'll lose the game!`)
    }
}

const close = () => {
    storeGames.close(props.game)
}

const quit = () => {
    storeGames.quit(props.game)
}

</script>

<template>
    <!-- <Card class="mx-auto my-8 p-2 px-4 min-w-[20rem] max-w-[25rem]"> -->
    <Card class="relative grow mx-4 mt-8 pt-2 pb-4 px-1 height:10px" :class="cardBgColor">
        <CardHeader class="pb-0">
            <Button @click="clickCardButton" class="absolute top-4 right-4" :class="buttonClasses">
                <!-- class="absolute -mt-8 -mr-20" :class="buttonClasses"> -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                {{ gameEnded ? 'Close' : 'Quit' }}
            </Button>
            <CardTitle>#{{ game.id }}</CardTitle>
            <CardDescription>
                <div class="text-base"><span class="font-bold">Opponent:</span> {{ opponentName }}
                    {{ game.status == 'interrupted' ? ' / Interrupted' :'' }}</div>
            </CardDescription>
        </CardHeader>
        <CardContent class="py-4 px-8">
            <h3 class="pt-0 text-2xl font-bold py-2" :class="statusMessageColor">
                {{ statusGameMessage }}
            </h3>
            <div>
                <Board :board="game.cards" :showCard="game.isCardTurned" :columns="game.boardCols" @play="playPieceOfBoard"></Board>
            </div>
        </CardContent>
    </Card>
</template>