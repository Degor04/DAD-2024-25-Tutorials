<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavBar from '../../common/NavBar.vue';
const storeAuth = useAuthStore();
const storeError = useErrorStore()
const router = useRouter()
const path = "/cards/";
const file_type = ".png";
const maxIndex = 13, jumpMax = 11;
const minIndex = 1, jumpMim = 7;
const hidden_card = path + `semFace` + file_type;
const cards_type_c = ref([]);
const cards_type_e = ref([]);
const cards_type_o = ref([]);
const cards_type_p = ref([]);
const all_cards = ref([]);
const cards = ref([]);
const optionSelect = 1;
const turnOneCard = ref([]);
const matchedCards = ref(new Set());
const countCartsTurned = ref(0);
const selectedCards = ref([]);
const total_turns = ref(0)
let startTime;
let stopwatchInterval;
let elapsedPausedTime = 0;
const displayTime = ref("00:00");

const boardHeight = ref(0)
const boardWidth = ref(0)

const gameRunning = ref(false)
const isNewGame = ref(true)
const gameWon = ref(false)

const gridCols = ref(['grid-cols-3', 'grid-cols-4', 'grid-cols-6'])


function initializeCards() {
  for (let i = minIndex; i <= maxIndex; i++) {
    if (i > jumpMim && i < jumpMax) {
      continue;
    }
    cards_type_c.value.push(path + `c${i}` + file_type);
    cards_type_e.value.push(path + `e${i}` + file_type);
    cards_type_o.value.push(path + `o${i}` + file_type);
    cards_type_p.value.push(path + `p${i}` + file_type);
  }
  all_cards.value.push(cards_type_c.value, cards_type_e.value, cards_type_o.value, cards_type_p.value);
}

const startGame = (chosenBoardHeight, chosenBoardWidth) => {
  boardHeight.value = chosenBoardHeight
  boardWidth.value = chosenBoardWidth

  buildGameDeck(boardWidth.value * boardHeight.value)

  gameRunning.value = true
  isNewGame.value = false
}

const buildGameDeck = (boardSize) => {
  let cardsToShuffle = cards_type_c.value

  let cardsToShuffleClone = [...cardsToShuffle.slice(0, boardSize / 2)];

  if (boardSize > 20) {
    cardsToShuffleClone.push(...cards_type_e.value.slice(0, 2));
  }

  cardsToShuffleClone = [...cardsToShuffleClone, ...cardsToShuffleClone];
  shuffle(cardsToShuffleClone);
  cards.value = cardsToShuffleClone;
  turnOneCard.value = Array(cardsToShuffleClone.length).fill(false);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
}

function startStopwatch() {
  if (!stopwatchInterval) {
    startTime = new Date().getTime() - elapsedPausedTime;
    stopwatchInterval = setInterval(updateStopwatch, 50);
    gameRunning.value = true
  }
}

function updateStopwatch() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  const milliseconds = elapsedTime % 1000;
  const seconds = Math.floor(elapsedTime / 1000) % 60;
  displayTime.value = pad(seconds) + ":" + pad(milliseconds);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  elapsedPausedTime = new Date().getTime() - startTime;
  stopwatchInterval = null;
}

function pad(number) {
  return (number < 10 ? "0" : "") + number;
}

function turnCard(index) {
  if (turnOneCard.value[index] || matchedCards.value.has(index) || selectedCards.value.length === 2) {
    return;
  }

  turnOneCard.value[index] = true;
  selectedCards.value.push(index);

  if (selectedCards.value.length === 2) {
    checkForMatch();
    total_turns.value++
  }

  if (countCartsTurned.value === 0) {
    startStopwatch();
  }
  countCartsTurned.value++
}

function checkForMatch() {
  const [firstIndex, secondIndex] = selectedCards.value;
  if (cards.value[firstIndex] === cards.value[secondIndex]) {
    matchedCards.value.add(firstIndex);
    matchedCards.value.add(secondIndex);
    selectedCards.value = [];

    if (matchedCards.value.size === cards.value.length) {
      gameWon.value = true;
      stopGame()
    }
  } else {
    setTimeout(() => {
      turnOneCard.value[firstIndex] = false;
      turnOneCard.value[secondIndex] = false;
      selectedCards.value = [];
    }, 1000);
  }
}

const stopGame = () => {
  stopStopwatch()
  gameRunning.value = false

  if (!storeAuth.user) { return }
  addGame()
}

const addGame = async () => {
  let startDate = new Date(startTime).toISOString().replace('Z', '')
  let endDate = new Date((startTime + elapsedPausedTime)).toISOString().replace('Z', '')

  try {
    let gameToInsert = {
      created_user_id: storeAuth.id,
      winner_user_id: storeAuth.id,
      type: 'S',
      status: 'E',
      began_at: startDate,
      ended_at: endDate,
      total_time: Math.floor(elapsedPausedTime / 1000) % 60,
      board_id: getBoardId()
    }
    console.log("about to post")
    const response = await axios.post('games', gameToInsert)
    console.log(response.data.data.id)
    const gameId = response.data.data.id
    if (getBoardId() == 2 || getBoardId() == 3) { // apenas 4x4 e 6x6 tiram uma brain coin
      addTransaction(gameId)
    }
  } catch (e) {
    storeError.setErrorMessages([], [], [], 'Error posting game')
  }
}


const credentials = ref({
  user_id: storeAuth.id,
  game_id: '',
  type: 'I',
  euros: null,
  payment_ref: null,
  payment_type: null,
  transaction_datetime: '',
  brain_coins: -1,
})

async function addTransaction(gameData) {
  if (storeAuth.userType == 'P') {
    const dateTransaction = new Date()
    credentials.value.transaction_datetime = formateDate(dateTransaction)
    credentials.value.game_id = gameData
    console.log(credentials)

    const response2 = await axios.post('transactionsUpdate', credentials.value); // criar a transacao na BD
    const response = await axios.post('/user/update-brain-coins', { // atualizar as brain coins do user
      brain_coins_balance: credentials.value.brain_coins
    });
    console.log('Brain coins updated:', response.data);
    //window.location.reload(); // atualizar a pagina
  }
  else {
    storeError.setErrorMessages('Only players can purchase brain coins')
  }
}

function formateDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const getBoardId = () => {
  let boardSize = boardHeight.value * boardWidth.value

  switch (boardSize) {
    case 12:
      return 1
    case 16:
      return 2
    case 36:
      return 3
  }
}

function plaAgain() {
  window.location.reload();
}


onMounted(() => {
  initializeCards();
});

</script>

<template>
  <div class="min-h-screen bg-green-100 flex flex-col items-center justify-center">

    <div v-if="storeAuth.userType == 'A'" class="text-center text-gray-600">
      <p>Looks like you are a Admin, Admins cannot play!</p>
    </div>
    <div v-if="storeAuth.userType == 'P'">
      <div v-if="isNewGame" class="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 class="text-xl font-bold mb-4 text-center">Pick a size for your game:</h2>
        <div class="flex flex-col space-y-4">
          <button @click="startGame(3, 4)" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            "3x4"
          </button>

          <button v-if="storeAuth.user" @click="startGame(4, 4)"
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            "4x4"
          </button>
          <button v-if="storeAuth.user" @click="startGame(6, 6)"
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            "6x6"
          </button>
        </div>
      </div>

      <div v-if="!isNewGame" class="bg-white shadow-lg rounded-lg p-6 box-content">

        <p class="text-lg font-semibold text-blue-600 mb-3">
          Total turns: {{ total_turns }}
          Time: {{ displayTime }}
        </p>


        <div :class="['grid', 'grid-cols-' + boardWidth, 'justify-items-center', 'gap-10']">
          <img v-for="(card, index) in cards" :key="index" @click="turnCard(index)"
            :src="turnOneCard[index] || matchedCards.has(index) ? card : hidden_card" class="rounded-lg cursor-pointer"
            width="51" height="90" />
        </div>

        <p v-if="!gameRunning && !isNewGame && gameWon" class="text-lg font-semibold text-blue-600 mb-3">
          You won. Congrats !!!
          <button @click="plaAgain" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded">
            Wanna play again ?
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
