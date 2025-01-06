<!--parte deste código foi providenciado pelo Diogo Gomes, aluno do IPL-->
<script lang="ts"> //tive de usar typescript porque os graficos do vue-chart-3 não suportam script setup
import { ref, computed, onMounted, defineComponent } from 'vue';
import { PieChart, BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';

Chart.register(...registerables);

export default defineComponent({
  name: 'Home',
  components: { PieChart, BarChart },
  setup() {

    const storeGame = useGameStore();
    const storeAuth = useAuthStore();
    const isLoading = ref(true);

    // buscar todos os jogos
    const games = computed(() => storeGame.games || []);

    // "query" para buscar os jogos singleplayer que acabaram
    const singleplayerGames = computed(() => {
      return games.value?.filter?.(
        (game) =>
          game.type === 'S' &&
          game.created_user_id === storeAuth.id &&
          game.status === 'E'
      ) || [];
    });
    // "query" para buscar os jogos multiplayer que acabaram
    const multiplayerGames = computed(() => {
      return games.value?.filter?.(
        (game) =>
          game.type === 'M' &&
          game.created_user_id === storeAuth.id &&
          game.status === 'E'
      ) || [];
    });
    
    const gamesPlayed = computed(() => {
      const games = storeGame.games || [];
      const currentUserId = storeAuth.id;
      
      //vai buscar só jogos singleplayer games
      const singleplayerGamesUser = games.filter(
        game => game.type === 'S' && game.created_user_id === currentUserId
      );

      const singleplayerGamesAll = games.filter(
        game => game.type === 'S' && game.status === 'E'
      );

      //vai buscar só jogos multiplayer games
      const multiplayerGamesUser = games.filter(
        game => game.type === 'M' && game.created_user_id === currentUserId
      );
      
      const single_3x4 = singleplayerGamesUser.filter(game =>  game.board_size === '3 x 4' ).length;
      const single_4x4 = singleplayerGamesUser.filter(game =>  game.board_size === '4 x 4' ).length;
      const single_6x6 = singleplayerGamesUser.filter(game => game.board_size === '6 x 6').length;

      const single_3x4_All = singleplayerGamesAll.filter(game =>  game.board_size === '3 x 4' ).length;
      const single_4x4_All = singleplayerGamesAll.filter(game =>  game.board_size === '4 x 4' ).length;
      const single_6x6_All = singleplayerGamesAll.filter(game => game.board_size === '6 x 6').length;

      const multi_3x4 = multiplayerGamesUser.filter(game => game.board_size === '3 x 4' ).length;
      const multi_4x4 = multiplayerGamesUser.filter(game => game.board_size === '4 x 4' ).length;
      const multi_6x6 = multiplayerGamesUser.filter(game => game.board_size === '6 x 6' ).length;

      const totalSingle = single_3x4 + single_4x4 + single_6x6;
      const totalMulti = multi_3x4 + multi_4x4 + multi_6x6;
      
      const totalSingleAll = single_3x4_All + single_4x4_All + single_6x6_All;

      //organizar jogos por mes
      const gamesByMonthUser = Array(12).fill(0); //criar array para os meses
      singleplayerGamesUser.forEach(game => {
        if (game.ended_at) {
          // extrair mes e ano da data
          const [year, month] = game.ended_at.split(' ')[0].split('-'); // "YYYY-MM-DD"
          const monthIndex = parseInt(month, 10) - 1; //(Jan = 0)
          gamesByMonthUser[monthIndex] += 1; 
        }
      });

      const gamesByMonthAll = Array(12).fill(0); //criar array para os meses
      singleplayerGamesAll.forEach(game => {
        if (game.ended_at) {
          // extrair mes e ano da data
          const [year, month] = game.ended_at.split(' ')[0].split('-'); // "YYYY-MM-DD"
          const monthIndex = parseInt(month, 10) - 1; //(Jan = 0)
          gamesByMonthAll[monthIndex] += 1; 
        }
      });


      return {
        single_3x4,
        single_4x4,
        single_6x6,
        totalSingle,
        totalSingleAll,
        multi_3x4,
        multi_4x4,
        multi_6x6,
        totalMulti,
        pieChartDataSingleplayer: {
          labels: ['3x4', '4x4', '6x6'],
          datasets: [
            {
              data: [single_3x4, single_4x4, single_6x6],
              backgroundColor: ['#77CEFF', '#0079AF', '#123E6B'],
            },
          ],
        },
        pieChartDataMultiplayer: {
          labels: ['3x4', '4x4', '6x6'],
          datasets: [
            {
              data: [multi_3x4, multi_4x4, multi_6x6],
              backgroundColor: ['#883100', '#FF8650', '#EDC194'],
            },
          ],
        },

        BarChartData:{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Singleplayer Games',
              data: gamesByMonthUser,
              backgroundColor: '#BADD1E'
            },
          ],
        },
        BarCharDataAll:{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Singleplayer Games',
              data: gamesByMonthAll,
              backgroundColor: '#BADD1E'
            },
          ],
        },
        pieChartDataAll: {
          labels: ['3x4', '4x4', '6x6'],
          datasets: [
            {
              data: [single_3x4_All, single_4x4_All, single_6x6_All],
              backgroundColor: ['#77CEFF', '#0079AF', '#123E6B'],
            },
          ],
        },
      };
    });

    const findLongestGame = (gamesList) => {
      if (!gamesList || gamesList.length === 0) return null;

      const longest = gamesList.reduce((longest, game) => {
        
        const currentTime = parseFloat(game.total_time) || 0;
        const longestTime = parseFloat(longest?.total_time) || 0;
        return currentTime > longestTime ? game : longest;
      }, null);

      console.log('Longest game:', longest);
      return longest;
    };

    const longestSingleplayerGame = computed(() => findLongestGame(singleplayerGames.value));
    const longestMultiplayerGame = computed(() => findLongestGame(multiplayerGames.value));

    const formatTime = (timeString) => {
      const seconds = parseFloat(timeString) || 0; 
      if (seconds <= 0) return '0m 0s';

      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}m ${secs}s`;
    };

    onMounted(async () => {
      try {
        await storeGame.fetchAllData();
        //console.log('Fetched games:', storeGame.games);//isto esconde-se para que os users não vejam
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        isLoading.value = false;
      }
    });

    return { isLoading, storeAuth, gamesPlayed, longestSingleplayerGame, longestMultiplayerGame, formatTime };
  },
});
</script>

<template>
  <div v-if="storeAuth.userType !== 'P' && storeAuth.userType !== 'A' " class="text-center text-gray-600">
    <p>Looks like you are not registered, log in or create an account to view your statistics.</p>
  </div>

  <div v-else class="container mx-auto p-6">
    <div v-if="isLoading" class="text-center text-gray-600">
      <p>Loading statistics... Please wait!</p>
    </div>

    <div v-else>
      <div v-if="storeAuth.userType === 'P'">
        <h2 class="text-xl font-bold text-blue-600 mb-4">Your Game Statistics</h2>
        
        <div class="mb-6 flex">
          <div class="w-1/2">
            <h3 class="text-lg font-semibold">Singleplayer Games</h3>
            <div style="width: 300px; height: 300px;">
              <PieChart :chartData="gamesPlayed.pieChartDataSingleplayer" />
            </div>
            <p class="mt-4">Total Singleplayer Games: <span class="font-semibold">{{ gamesPlayed.totalSingle }}</span></p>
          </div>
        </div>
        <div>
          <BarChart :chartData="gamesPlayed.BarChartData" />
        </div>
        <br>
        <div class="mb-6">
          <h3 class="text-lg font-semibold">Multiplayer Games</h3>
          <div style="width: 300px; height: 300px;">
            <PieChart :chartData="gamesPlayed.pieChartDataMultiplayer" />
          </div>
          <p class="mt-4">Multiplayer Games created or won: <span class="font-semibold">{{ gamesPlayed.totalMulti }}</span></p>
        </div>


        <div class="mb-6">
          <h3 class="text-lg font-semibold">Longest Games</h3>
          <div v-if="longestSingleplayerGame">
            <p>Longest Singleplayer Game: {{ formatTime(longestSingleplayerGame.total_time) }}</p>
            <p>Board Size: {{ longestSingleplayerGame.board_size }}</p>
          </div>
          <div v-else>
            <p>No singleplayer games found.</p>
          </div>

          <div v-if="longestMultiplayerGame">
            <p>Longest Multiplayer Game: {{ formatTime(longestMultiplayerGame.total_time) }}</p>
            <p>Board Size: {{ longestMultiplayerGame.board_size }}</p>
          </div>
          <div v-else>
            <p>No multiplayer games found.</p>
          </div>
        </div>
      </div>
      <div v-else-if="storeAuth.userType === 'A'">
        <div class="mb-6 flex">
          <div class="w-1/2">
            <h3 class="text-lg font-semibold">Singleplayer Games</h3>
            <div style="width: 300px; height: 300px;">
              <PieChart :chartData="gamesPlayed.pieChartDataAll" />
            </div>
            <p class="mt-4">Total Singleplayer Games: <span class="font-semibold">{{ gamesPlayed.totalSingleAll }}</span></p>
          </div>
        </div>
        <div class="mb-6">
          <h3 class="text-lg font-semibold">Multiplayer Games</h3>
          <div>
            <BarChart :chartData="gamesPlayed.BarCharDataAll" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>