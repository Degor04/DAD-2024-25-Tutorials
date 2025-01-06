<script setup>
import { inject } from 'vue'
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { User } from 'lucide-vue-next';
import GameCard from '../components/GameHistory/GameCard.vue';
import ScoreBoardCard from '../components/ScoreBoard/ScoreBoardCard.vue';

const storeGame = useGameStore()
const storeAuth = useAuthStore()
const route = useRoute()

const alertDialog = inject('alertDialog')


const counterAllGames = ref(0)
var isloading = ref(true)
var showPersonal = ref(false)


function loading() {
  setTimeout(() => { isloading.value = false })
}



function endedAllGames() {
  counterAllGames.value = storeGame.games.filter(
    (game) => game.status === 'E'
  ).length
}


function showPersonalFuncion() {
  if (showPersonal.value) {
    showPersonal.value = false
  }
  else {
    showPersonal.value = true
  }
  console.log(showPersonal.value)
}


const spGamesPersonal3x4Time = computed(() => {
  const mySinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.created_user_id == storeAuth.id && game.status == 'E' && game.board_size == '3 x 4')
  return mySinglePlayerGames.sort((a, b) => a.total_time - b.total_time)[0] // ordena os jogos por tempo e retorna o com menor tempo, a primeira posicao do vetor
})

const spGamesPersonal4x4Time = computed(() => {
  const mySinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.created_user_id == storeAuth.id && game.status == 'E' && game.board_size == '4 x 4')
  return mySinglePlayerGames.sort((a, b) => a.total_time - b.total_time)[0]
})
const spGamesPersonal6x6Time = computed(() => {
  const mySinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.created_user_id == storeAuth.id && game.status == 'E' && game.board_size == '6 x 6')
  return mySinglePlayerGames.sort((a, b) => a.total_time - b.total_time)[0]
})

const spGamesPersonal3x4Turns = computed(() => {
  const mySinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.created_user_id == storeAuth.id && game.status == 'E' && game.board_size == '3 x 4')
  return mySinglePlayerGames.sort((a, b) => {
    if (a.total_turns_winner !== b.total_turns_winner) {
      return a.total_turns_winner - b.total_turns_winner
    }
    return a.total_time - b.total_time // em caso de empate usamos o tempo de jogo 
  })[0]
})

const spGamesPersonal4x4Turns = computed(() => {
  const mySinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.created_user_id == storeAuth.id && game.status == 'E' && game.board_size == '4 x 4')
  return mySinglePlayerGames.sort((a, b) => {
    if (a.total_turns_winner !== b.total_turns_winner) {
      return a.total_turns_winner - b.total_turns_winner
    }
    return a.total_time - b.total_time
  })[0]
})
const spGamesPersonal6x6Turns = computed(() => {
  const mySinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.created_user_id == storeAuth.id && game.status == 'E' && game.board_size == '6 x 6')
  return mySinglePlayerGames.sort((a, b) => {
    if (a.total_turns_winner !== b.total_turns_winner) {
      return a.total_turns_winner - b.total_turns_winner
    }
    return a.total_time - b.total_time
  })[0]
})

const spGamesGlobal3x4Time = computed(() => {
  const allSinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.status == 'E' && game.board_size == '3 x 4')
  return allSinglePlayerGames.sort((a, b) => a.total_time - b.total_time)[0]
})

const spGamesGlobal4x4Time = computed(() => {
  const allSinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.status == 'E' && game.board_size == '4 x 4')
  return allSinglePlayerGames.sort((a, b) => a.total_time - b.total_time)[0]
})

const spGamesGlobal6x6Time = computed(() => {
  const allSinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.status == 'E' && game.board_size == '6 x 6')
  return allSinglePlayerGames.sort((a, b) => a.total_time - b.total_time)[0]
})

const spGamesGlobal3x4Turns = computed(() => {
  const allSinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.status == 'E' && game.board_size == '3 x 4')
  return allSinglePlayerGames.sort((a, b) => {
    if (a.total_turns_winner !== b.total_turns_winner) {
      return a.total_turns_winner - b.total_turns_winner
    }
    return a.total_time - b.total_time
  })[0]
})

const spGamesGlobal4x4Turns = computed(() => {
  const allSinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.status == 'E' && game.board_size == '4 x 4')
  return allSinglePlayerGames.sort((a, b) => {
    if (a.total_turns_winner !== b.total_turns_winner) {
      return a.total_turns_winner - b.total_turns_winner
    }
    return a.total_time - b.total_time
  })[0]
})

const spGamesGlobal6x6Turns = computed(() => {
  const allSinglePlayerGames = storeGame.games.filter(game => game.type == 'S' && game.status == 'E' && game.board_size == '6 x 6')
  return allSinglePlayerGames.sort((a, b) => {

    if (a.total_turns_winner !== b.total_turns_winner) {
      return a.total_turns_winner - b.total_turns_winner
    }

    return a.total_time - b.total_time
  })[0]
})

const spGamesGlobalTime = computed(() => {
  return [
    spGamesGlobal3x4Time.value,
    spGamesGlobal4x4Time.value,
    spGamesGlobal6x6Time.value,
  ].filter(game => game !== undefined)
})

const spGamesGlobalTurns = computed(() => {
  return [
    spGamesGlobal3x4Turns.value,
    spGamesGlobal4x4Turns.value,
    spGamesGlobal6x6Turns.value,
  ].filter(game => game !== undefined)
})


const spGamesPersonalTime = computed(() => {
  return [
    spGamesPersonal3x4Time.value,
    spGamesPersonal4x4Time.value,
    spGamesPersonal6x6Time.value,
  ].filter(game => game !== undefined)
})

const spGamesPersonalTurns = computed(() => {
  return [
    spGamesPersonal3x4Turns.value,
    spGamesPersonal4x4Turns.value,
    spGamesPersonal6x6Turns.value,
  ].filter(game => game !== undefined)
})

const myTotalWins = computed(() => {
  const mygames = storeGame.games.filter(game => game.type == 'M' && game.status == 'E' && game.winner_user_id == storeAuth.id )
  
  return mygames.length

})

const top5Winners = computed(() => {
  const allMPGames = storeGame.games.filter(game => game.type == 'M' && game.status == 'E')

  const count_winner_user_id_occurrences = {}

  // percorrer os games e por cada winner_user_id adicionar 1 para cada ocorrencia
  allMPGames.forEach(game => {
    const winner_user_id = game.winner_user_id
    if (count_winner_user_id_occurrences[winner_user_id]) {
      count_winner_user_id_occurrences[winner_user_id]++
    } else {
      count_winner_user_id_occurrences[winner_user_id] = 1
    }
  })
  console.log(allMPGames)
  return Object.entries(count_winner_user_id_occurrences)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)        // obter os 5 primeiros winner_user_id
    .map(([winner_user_id, count]) => { // criar um novo array com o winner_user_id e o count
      const userGames = allMPGames.find(game => game.winner_user_id == winner_user_id) // procurar o jogo que corresponde ao winner_user_id
      return {
        winner_user_id: Number(winner_user_id),
        count: count,
        user_nickname: userGames.user_nickname,
      }
    })
})


onMounted(() => {
  storeGame.fetchAllData().then(() => {
    endedAllGames()
    loading()
  })
  
})
</script>


<template>
  <div v-if="isloading" class="text-center text-gray-600">
    <p>Loading ScoreBoard... Please wait! </p>
  </div>
  <div v-if="!isloading"  class="container mx-auto p-6">
    <button v-if="storeAuth.userType == 'P'" type="button"
      class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none transition duration-200 mb-4"
      @click="showPersonalFuncion">
      <span v-if="showPersonal ">Switch to Global ScoreBoard </span>
      <span v-else>Switch to Personal ScoreBoard</span>
    </button>
    
    <!-- 
    Personal Scoreboard 
    -->
    <div v-if="showPersonal">
      <p class="text-lg font-semibold text-blue-600"> Your total wins: {{ myTotalWins }}<br> Your total Loses: X</p>
      
      <div v-if="spGamesPersonalTime.length || spGamesPersonalTurns.length" class="grid grid-cols-3 gap-6 mt-6">
        <div v-for="(game, index) in spGamesPersonalTime" :key="game.id"
          class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
          <p class="text-lg font-semibold  text-gray-800"> Games with less time
            <p v-if="index==0" >for 3x4</p>
            <p v-if="index==1" >for 4x4</p>
            <p v-if="index==2" >for 6x6</p>
          </p>
          <GameCard :game="game"></GameCard>
          <ScoreBoardCard :nickname="game"></ScoreBoardCard>
        </div>
        
        <div v-for="(game, index) in spGamesPersonalTurns" :key="game.id"
          class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
          <p class="text-lg font-semibold  text-gray-800"> Games with less turns
            <p v-if="index==0" >for 3x4</p>
            <p v-if="index==1" >for 4x4</p>
            <p v-if="index==2" >for 6x6</p>
          </p>
          <GameCard :game="game"></GameCard>
          <ScoreBoardCard :nickname="game"></ScoreBoardCard>
        </div>
      </div>
      <div v-else>
        <p class="text-lg font-semibold text-blue-600">
          No single player games registered
        </p>
        <p class="text-center text-gray-600 mt-6">
          Oh no! It looks like you're not playing any single player games. Don't just sit there. Let the fun begin!
        </p>
      </div>
    </div>


    <!-- 
    Global Scoreboard 
    -->
    <div v-if="!showPersonal">
      <div v-if="isloading" class="text-center text-gray-600">
        <p>Loading ScoreBoard... Please wait!</p>
      </div>
      <!-- 
    Top 5 Global 
    -->
      <p v-if="!isloading" class="text-lg font-semibold text-blue-600">
        Check our top 5 players</p>
      <div v-if="top5Winners.length" class="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-6 mt-6 mb-6">
        <div v-for="users in top5Winners" :key="users.user_nickname"
          class=" bg-white rounded-lg shadow hover:shadow-lg transition duration-200 ">
          <span class="text-sm text-gray-500"> Nickname of the user: {{ users.user_nickname }} <br> Total Games won: {{ users.count }}</span>
        </div>
      </div>
      <p v-if="!isloading" class="text-lg font-semibold text-blue-600 ml-1">
        Between all {{ counterAllGames }} ended games this ones are the best !!!<br>
      If your game is here congrats
      </p>
      <div v-if="spGamesGlobalTime.length || spGamesGlobalTurns.length">
        <div v-if="spGamesGlobalTime.length" class="grid grid-cols-3 gap-6 mt-6">
          <div v-for="(game, index) in spGamesGlobalTime" :key="game.id"
            class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
            <p class="text-lg font-semibold  text-gray-800"> Games with less time
            <p v-if="index==0" >for 3x4</p>
            <p v-if="index==1" >for 4x4</p>
            <p v-if="index==2" >for 6x6</p>
          </p>
            <GameCard :game="game"></GameCard>
            <ScoreBoardCard :nickname="game"></ScoreBoardCard>
          </div>
        </div>

        <div v-if="spGamesGlobalTurns.length" class="grid grid-cols-3 gap-6 mt-6">
          <div v-for="(game, index)  in spGamesGlobalTurns" :key="game.id"
            class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
            <p class="text-lg font-semibold text-gray-800"> Games with less turns
            <p v-if="index==0" >for 3x4</p>
            <p v-if="index==1" >for 4x4</p>
            <p v-if="index==2" >for 6x6</p>
          </p>
            <GameCard :game="game"></GameCard>
            <ScoreBoardCard :nickname="game"></ScoreBoardCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
