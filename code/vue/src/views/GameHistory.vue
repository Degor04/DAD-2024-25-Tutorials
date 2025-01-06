<script setup>
import { inject } from 'vue'
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { User } from 'lucide-vue-next';
import GameCard from '../components/GameHistory/GameCard.vue';

const storeGame = useGameStore()
const storeAuth = useAuthStore()
const route = useRoute()

const alertDialog = inject('alertDialog')

const counterGamesPlayer = ref(0)
var isloading = ref(true)

const currentPage = ref(1); // ao abrir o site estara na 1 pagina
const numberGamesPerPage = 9;

const jumpPage = ref(currentPage.value);

const paginatedGames = computed(() => {
  const startIndex = (currentPage.value - 1) * numberGamesPerPage;
  const lastPage = startIndex + numberGamesPerPage;
  return storeGame.games.filter(
    (game) => game.created_user_id === storeAuth.id
  ).slice(startIndex, lastPage);
});

const paginatedGamesAdmin = computed(() => {
  const startIndex = (currentPage.value - 1) * numberGamesPerPage;
  const lastPage = startIndex + numberGamesPerPage;
  return storeGame.games.slice(startIndex, lastPage);
});

const totalPagesAdmin = computed(() => {
  return Math.ceil(storeGame.games.length / numberGamesPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(counterGamesPlayer.value / numberGamesPerPage);
});

function goToNextPageAdmin() {
  if (currentPage.value < totalPagesAdmin.value) {
    currentPage.value++;
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function loading() {
  setTimeout(() => { isloading.value = false; });
}

function updateCounters() {
  counterGamesPlayer.value = storeGame.games.filter(
    (game) => game.created_user_id === storeAuth.id || game.winner_user_id === storeAuth.id
  ).length;
}



function goToPage(pageNumber) {
  const targetPage = parseInt(pageNumber, 10); // 10 significa que o numero recebido esta na base decimal
  if (targetPage >= 1 && targetPage <= totalPages.value) {
    currentPage.value = targetPage;
    jumpPage.value = targetPage; 
    // to do
    // adicionar pop-up de erro para input invalido
  }
}

function goToPageAdmin(pageNumber) {
  const targetPage = parseInt(pageNumber, 10); // 10 significa que o numero recebido esta na base decimal
  if (targetPage >= 1 && targetPage <= totalPagesAdmin.value) {
    currentPage.value = targetPage;
    jumpPage.value = targetPage;
    // adicionar pop-up de erro para input invalido
  }
}


onMounted(() => {
  storeGame.fetchAllData().then(() => {
    updateCounters();
    loading();
  });
  
});

</script>


<template>

  <div class="container mx-auto p-6">
    <div>
      <div v-if="storeAuth.userType === 'P'">
        <div v-if="isloading" class="text-center text-gray-600">
          <p>Loading your games... Please wait!</p>
        </div>
        <div v-if="counterGamesPlayer > 0">
          <p class="text-lg font-semibold text-blue-600">
            You have {{ counterGamesPlayer }} game(s). Great job!
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div v-for="game in paginatedGames" :key="game.id"
              class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
              <!---     Ver se o player tem jogos-->
              <div v-if="game.created_user_id == storeAuth.id || game.winner_user_id == storeAuth.id">
                <GameCard :game="game"></GameCard>
                <div v-if="game.type === 'M'" class="mt-2 text-sm text-blue-500">
                  <span>Player id : {{ game.created_user_id }} | Winner id: {{ game.winner_user_id }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination mt-6 flex justify-center items-center gap-4">
            <button @click="goToPreviousPage" :disabled="currentPage === 1"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <input v-model="jumpPage" type="number" min="1" :max="totalPagesAdmin"
              class="w-16 px-2 py-1 border rounded text-center" placeholder="Go to" />

            <button @click="goToPage(jumpPage)" :disabled="jumpPage < 1 || jumpPage > totalPagesAdmin"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
              Go
            </button>
            <button @click="goToNextPage" :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
              Next
            </button>
          </div>
        </div>
        <div v-if="!isloading && counterGamesPlayer == 0" class="text-center text-gray-600 mt-6">
          <p>
            Oh no! It looks like you're not playing any games. Don't just sit
            there. Let the fun begin!
          </p>
        </div>
      </div>

      <div v-if="storeAuth.userType === 'A'">
        <div v-if="isloading" class="text-center text-gray-600">
          <p>Loading data... Please wait!</p>
        </div>
        <div v-if="storeGame.games.length === 0 && !isloading" class="text-center text-gray-600">
          <p>
            No one has played yet. Invite your friends to check your amazing
            site!
          </p>
        </div>
        <div v-if="!isloading">
          <p class="text-lg font-semibold text-blue-600">
            Total games: {{ storeGame.games.length }} registered
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div v-for="game in paginatedGamesAdmin" :key="game.id"
              class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
              <GameCard :game="game"></GameCard>
            </div>
          </div>
          <div class="pagination mt-6 flex justify-center items-center gap-4">
            <button @click="goToPreviousPage" :disabled="currentPage === 1"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage }} of {{ totalPagesAdmin }}
            </span>
            <input v-model="jumpPage" type="number" min="1" :max="totalPagesAdmin"
                class="w-16 px-2 py-1 border rounded text-center" placeholder="Go to" />
  
              <button @click="goToPageAdmin(jumpPage)" :disabled="jumpPage < 1 || jumpPage > totalPagesAdmin"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
                Go
              </button>
            <button @click="goToNextPageAdmin" :disabled="currentPage === totalPagesAdmin"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
              Next
            </button>
          </div>
        </div>
      </div>

      <div v-if="storeAuth.userType !== 'A' && storeAuth.userType !== 'P'" class="text-center text-gray-600 mt-6">
        <p>No games were found</p>
        <p>Please login to track your game history</p>
      </div>
    </div>
  </div>
</template>
