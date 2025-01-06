exports.createUtil = () => {
    // Global util functions to use in the socket.io
    const checkAuthenticatedUser = (socket, callback) => {
        if (!socket.data.user) {
            if (callback) {
                callback({
                    errorCode: 2,
                    errorMessage: 'User is not authenticated!'
                })
            }
            return false
        }
        return true
    }
    const getRoomGamesPlaying = (socket) => {
        const rooms = socket.adapter.rooms
        // roomsPlaying = MAP with the list of rooms where current socket is playing
        return [...rooms].filter(([k, v]) =>
                (k.indexOf('game_') == 0) &&
                ((v.game.player1SocketId == socket.id) || (v.game.player2SocketId == socket.id))
            )
    }

    const getGamesPlaying = (socket) => {
        return getRoomGamesPlaying(socket).map(([k, v]) => v.game)
    }

    return {
        checkAuthenticatedUser, getRoomGamesPlaying, getGamesPlaying
    }
}