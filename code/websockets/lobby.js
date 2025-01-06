exports.createLobby = () => {
    const games = new Map()
    let id = 1

    const addGame = (user, socketId, boardId) => {
        id++
        const game = {
            id: id,
            created_at: Date.now(),
            player1: user,
            player1SocketId: socketId,
            board_id: boardId
        }
        games.set(id, game)
        return game
    }

    const removeGame = (id) => {
        games.delete(id)
        return games
    }

    const existsGame = (id) => {
        return games.has(id)
    }

    const getGame = (id) => {
        return games.get(id)
    }

    const getGames = () => {
        return [...games.values()]
    }

    const leaveLobby = (socketId) => {
        const gamesToDelete = [...games.values()].filter(game => game.player1SocketId == socketId)
        gamesToDelete.forEach(game => {
            games.delete(game.id)
        })
        return getGames()
    }

    return {
        getGames,
        getGame,
        addGame,
        removeGame,
        existsGame,
        leaveLobby
    }
}