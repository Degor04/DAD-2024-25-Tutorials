exports.createGameEngine = () => {
    //Game initialization
    const initGame = (gameFromDB) => {
        let cards_type_c = []
        let cards_type_e = []
        let cards_type_o = []
        let cards_type_p = []
        let cards = []
        let isCardTurned = []
        const populateCardPaths = () => {
            const path = "/cards/"
            const file_type = ".png"
            const maxIndex = 13, jumpMax = 11;
            const minIndex = 1, jumpMim = 7;
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
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
              const randomIndex = Math.floor(Math.random() * (i + 1));
              [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
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
            cards = cardsToShuffleClone;
            isCardTurned = Array(cardsToShuffleClone.length).fill(false);
        }
        populateCardPaths()
        gameFromDB.boardCols = gameFromDB.board_id === 1 ? 3 : gameFromDB.board_id === 2 ? 4 : 6
        gameFromDB.boardRows = gameFromDB.board_id !== 3 ? 4 : 6
        buildGameDeck(gameFromDB.boardCols * gameFromDB.boardRows)

        gameFromDB.gameStatus = null
        // null -> game has not started yet
        // 0 -> game has started and running
        // 1 -> player 1 is the winner
        // 2 -> player 2 is the winner
        // 3 -> draw
        gameFromDB.currentPlayer = 1
        
        gameFromDB.cards = [...cards]
        gameFromDB.isCardTurned = [...isCardTurned]
        gameFromDB.points = [0,0]
        gameFromDB.selectedCards = []
        gameFromDB.turns = 0
        gameFromDB.startingTime = 0
        gameFromDB.endingTime = 0
        
        return gameFromDB
    }

    // ------------------------------------------------------
    // Actions / Methods
    // ------------------------------------------------------

    
    // Check if the board is complete and change the gameStatus accordingly
    const changeGameStatus = (game) => {
        if (!game.isCardTurned.every(value => value === true)){
            game.gameStatus = 0
            return
        }
        
        if (game.points[0] > game.points[1]){
            game.gameStatus = 1
        }
        else if (game.points[0] < game.points[1]){
            game.gameStatus = 2
        }
        else{
            game.gameStatus = 3
        }

        //If game has ended save the time
        game.endingTime = new Date().getTime();
    }

    //Checks for match and updates the points
    const checkForMatch = (game) => {
        const [firstIndex, secondIndex] = game.selectedCards;
        if (game.cards[firstIndex] === game.cards[secondIndex]) {
          game.points[game.currentPlayer - 1]++
          game.selectedCards = [];
        } else {
          setTimeout(() => {
            game.isCardTurned[firstIndex] = false;
            game.isCardTurned[secondIndex] = false;
            game.selectedCards = [];
          }, 1000);
        }
      }

    
    // returns whether the game as ended or not
    const gameEnded = (game) => game.gameStatus > 0


    // Plays a specific piece of the game (defined by its index)
    // Returns true if the game play is valid or an object with an error code and message otherwise
    const play = (game, index, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) && (playerSocketId != game.player2SocketId)){
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (gameEnded(game)) {
            return {
                errorCode: 11,
                errorMessage: 'Game has already ended!'
            }
        }
        if (((game.currentPlayer == 1) && (playerSocketId != game.player1SocketId))
            ||
            ((game.currentPlayer == 2) && (playerSocketId != game.player2SocketId))){
            return {
                errorCode: 12,
                errorMessage: 'Invalid play: It is not your turn!'
            }
        }
        if (game.isCardTurned[index] === true) {
            return {
                errorCode: 13,
                errorMessage: 'Invalid play: card is already turned!'
            }
        }
        if (game.selectedCards.length === 2) {
            return {
                errorCode: 14,
                errorMessage: 'Invalid play: you have already selected two cards!'
            }
        }

        game.isCardTurned[index] = true
        game.selectedCards.push(index)

        if (game.selectedCards.length === 2) {
            checkForMatch(game)
            changeGameStatus(game)
            game.currentPlayer = game.currentPlayer === 1 ? 2 : 1
            game.turns++
        }

        if (game.turns === 0 && game.selectedCards.length === 1){
            game.startingTime = new Date().getTime();
        }

        return true
    }

    

    // One of the players quits the game. The other one wins the game
    const quit = (game, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) && (playerSocketId != game.player2SocketId)){
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (gameEnded(game)) {
            return {
                errorCode: 11,
                errorMessage: 'Game has already ended!'
            }
        }
        game.gameStatus = playerSocketId == game.player1SocketId ? 2 : 1
        return true
    }

    // Check if socket can close the game (game must have ended and player must belong to game)
    const close = (game, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) && (playerSocketId != game.player2SocketId)){
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (!gameEnded(game)) {
            return {
                errorCode: 15,
                errorMessage: 'Cannot close a game that has not ended!'
            }
        }
        return true
    }

    return {
        initGame,
        gameEnded,
        play,
        quit,
        close
    }
}