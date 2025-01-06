import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'


export const useLobbyStore = defineStore('lobby', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const socket = inject('socket')

    const games = ref([])

    const totalGames = computed(() => games.value.length)

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    // when the lobby changes on the server, it is updated on the client
    socket.on('lobbyChanged', (lobbyGames) => {
        games.value = lobbyGames
    })

    // fetch lobby games from the Websocket server
    const fetchGames = () => {
        storeError.resetMessages()
        socket.emit('fetchGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            games.value = response
        })
    }

    // add a game to the lobby
    const addGame = (board_id) => {
        storeError.resetMessages()
        socket.emit('addGame', board_id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    // remove a game from the lobby
    const removeGame = (id) => {
        storeError.resetMessages()
        socket.emit('removeGame', id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    // join a game of the lobby
    const joinGame = (id) => {
        storeError.resetMessages()
        socket.emit('joinGame', id, async (response) => {
            // callback executed after the join is complete
            if (webSocketServerResponseHasError(response)) {
                return
            }
            const APIgameresponse = await axios.post('games', {
                type: 'M',
                status: 'PE',
                board_id: response.board_id,
            })
            const APIresponse = await axios.post('multiplayer_games', {
                user_id: response.player1.id,
                game_id: APIgameresponse.data.data.id
            })
            const newGameOnDB = APIresponse.data.data
            newGameOnDB.player1SocketId = response.player1SocketId
            newGameOnDB.player2SocketId = response.player2SocketId
            // After adding the game to the DB emit a message to the server to start the game
            socket.emit('startGame', newGameOnDB, (startedGame) => {
                console.log('Game has started', startedGame)
            })
        })
    }

    // Whether the current user can remove a specific game from the lobby
    const canRemoveGame = (game) => {
        return game.player1.id === storeAuth.id
    }

    // Whether the current user can join a specific game from the lobby
    const canJoinGame = (game) => {
        return game.player1.id !== storeAuth.id
    }

    return {
        games, totalGames, fetchGames, addGame, joinGame, canJoinGame, removeGame, canRemoveGame
    }
})