import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'

export const useGameStore = defineStore('game,nickname', () => {
    const router = useRouter()
    const storeError = useErrorStore()

    const games = ref([])
    const userNickname = ref([])

    const fetchGames = async (page = 1) => {
        storeError.resetMessages()
        const response = await axios.get('gameHistory')
        return response.data.data.map(game => ({
            ...game,
            board_size: game.board_size || 'Error',
            
        }))
        console.log(games)
    }

        const fetchNickname = async (page = 1) => {
            storeError.resetMessages()
            const response2 = await axios.get('scoreBoard')
            return  response2.data.data.map(nickname => ({
                ...nickname,
                
                user_nickname: nickname.user_nickname || 'No username',
            }))

            //console.log(userNickname.value);
            console.log(userNickname)
            
        }


        const fetchAllData = async () => {
            const gamesData = await fetchGames()  // Busca jogos
            const nicknamesData = await fetchNickname()  // Busca nicknames
    
            // Combinar os dados de jogos e nicknames
            games.value = gamesData.map((game, index) => ({
                ...game,
                user_nickname: nicknamesData[index]?.user_nickname || 'No username',
                total_turns_winner: nicknamesData[index]?.total_turns_winner || 'No data total turns'
            }))
        }

        return {
            games,
            userNickname,
            fetchGames,
            fetchNickname,
            fetchAllData
        }
    })
