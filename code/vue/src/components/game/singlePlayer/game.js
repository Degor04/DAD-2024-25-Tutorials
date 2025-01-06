import {ref} from 'vue'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth';

export function useGame(){
    const storeError = useErrorStore()
    const storeAuth = useAuthStore()
    const path = "/cards/";
    const file_type = ".png";
    const hidden_card = path + `semFace` + file_type;
    const maxIndex = 13, jumpMax = 11;
    const minIndex = 1, jumpMim = 7;

    let cards_type_c = [];
    let cards_type_e = [];
    let cards_type_o = [];
    let cards_type_p = [];

    const cards = ref([]);
    
    const isCardTurned = ref([]);
    const matchedCards = ref(new Set());
    const countCartsTurned = ref(0);
    const selectedCards = ref([]);
    const total_turns = ref(0)
    let startTime = 0;
    let stopwatchInterval = 0;
    let elapsedPausedTime = 0;
    const displayTime = ref("00:00");

    const boardHeight = ref(0)
    const boardWidth = ref(0)

    const gameRunning = ref(false)
    const isNewGame = ref(true)
    const gameWon = ref(false)

    const initializeCards = () => {
        for (let i = minIndex; i <= maxIndex; i++) {
          if (i > jumpMim && i < jumpMax) {
            continue;
          }
          cards_type_c.push(path + `c${i}` + file_type);
          cards_type_e.push(path + `e${i}` + file_type);
          cards_type_o.push(path + `o${i}` + file_type);
          cards_type_p.push(path + `p${i}` + file_type);
        }
    }

      const buildGameDeck = (boardSize) => {
        let cardsToShuffle = cards_type_c
      
        let cardsToShuffleClone = [...cardsToShuffle.slice(0, boardSize / 2)];
        
        if (boardSize > 20) {
          cardsToShuffleClone.push(...cards_type_e.slice(0, 2));
        }
      
        cardsToShuffleClone = [...cardsToShuffleClone, ...cardsToShuffleClone];
        shuffle(cardsToShuffleClone);
        cards.value = cardsToShuffleClone;
        isCardTurned.value = Array(cardsToShuffleClone.length).fill(false);
      }
      
      const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const randomIndex = Math.floor(Math.random() * (i + 1));
          [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
      }
      
    const startGame = (chosenBoardHeight, chosenBoardWidth) => {
        boardHeight.value = chosenBoardHeight
        boardWidth.value = chosenBoardWidth
        
        buildGameDeck(boardWidth.value * boardHeight.value)
        
        gameRunning.value = true
        isNewGame.value = false
    }

    const close = () => {
        resetValues()
    }

    const quit = () => {
        stopStopwatch()
        resetValues()
    }

    const resetValues = () =>{
        isNewGame.value = true
        isCardTurned.value = []
        matchedCards.value = new Set()
        countCartsTurned.value = 0
        selectedCards.value = []
        total_turns.value = 0
        startTime = 0
        stopwatchInterval = 0
        elapsedPausedTime = 0
        displayTime.value = "00:00"
        gameWon.value = false
        gameRunning.value = false
    }

      const turnCard = (index) => {
        if (isCardTurned.value[index] || matchedCards.value.has(index) || selectedCards.value.length === 2) {
          return;
        }
      
        isCardTurned.value[index] = true;
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

      const checkForMatch = () => {
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
            isCardTurned.value[firstIndex] = false;
            isCardTurned.value[secondIndex] = false;
            selectedCards.value = [];
          }, 1000);
        }
      }

      const stopGame = () => {
        stopStopwatch()
        gameRunning.value = false
        
        if (!storeAuth.user) {return}
        addGame()
      }

      const getBoardId = () => {
        let boardSize = boardHeight.value * boardWidth.value
      
        switch(boardSize){
          case 12:
            return 1
          case 16:
            return 2
          case 36:
            return 3
        }
      }


      const startStopwatch = () => {
        if (!stopwatchInterval) {
          startTime = new Date().getTime() - elapsedPausedTime;
          stopwatchInterval = setInterval(updateStopwatch, 50);
          gameRunning.value = true
        }
      }
      
      const updateStopwatch = () => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        const milliseconds = elapsedTime % 1000;
        const seconds = Math.floor(elapsedTime / 1000)
        displayTime.value = pad(seconds) + ":" + pad(milliseconds);
      }
      
      const stopStopwatch = () => {
        clearInterval(stopwatchInterval);
        elapsedPausedTime = new Date().getTime() - startTime;
        stopwatchInterval = null;
      }
      
      const pad = (number) => {
        return (number < 10 ? "0" : "") + number;
      }

      const addGame = async () => {
        let startDate = new Date(startTime).toISOString().replace('Z', '')
        let endDate = new Date((startTime + elapsedPausedTime)).toISOString().replace('Z', '')
        
        const timeParts = displayTime.value.split(":");
        const seconds = parseInt(timeParts[0], 10);
        const milliseconds = parseInt(timeParts[1], 10);

        try {
          let gameToInsert = {
              winner_user_id: storeAuth.id,
              type: 'S',
              status: 'E',
              began_at: startDate,
              ended_at: endDate,
              total_time: seconds + (milliseconds / 1000),
              board_id: getBoardId()
          }
            console.log("about to post")
            const response = await axios.post('games', gameToInsert)
        } catch (e) {
          storeError.setErrorMessages([], [], [], 'Error posting game')
        }
      }

      return {
        cards,
        isCardTurned,
        matchedCards,
        total_turns,
        displayTime,
        boardHeight,
        boardWidth,
        gameRunning,
        isNewGame,
        gameWon,
        hidden_card,
        initializeCards,
        startGame,
        turnCard,
        close,
        quit
    }
}