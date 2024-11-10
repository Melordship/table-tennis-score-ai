import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { GameState } from 'shared'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const gameState: GameState = {
  player1Score: 0,
  player2Score: 0,
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  gameHistory: []
}

io.on('connection', (socket) => {
  // Send current state to new connections
  socket.emit('scoreUpdate', gameState)
  socket.emit('playerNames', {
    player1Name: gameState.player1Name,
    player2Name: gameState.player2Name
  })

  socket.on('updateScore', (data) => {
    gameState.player1Score = data.player1Score
    gameState.player2Score = data.player2Score
    io.emit('scoreUpdate', gameState)
  })

  socket.on('updateNames', (data) => {
    gameState.player1Name = data.player1Name
    gameState.player2Name = data.player2Name
    io.emit('playerNames', {
      player1Name: gameState.player1Name,
      player2Name: gameState.player2Name
    })
  })

  socket.on('endFrame', (data) => {
    gameState.gameHistory.push({
      player1Score: data.player1Score,
      player2Score: data.player2Score,
      player1Win: data.player1Score > data.player2Score,
      player2Win: data.player2Score > data.player1Score
    })
    io.emit('scoreUpdate', gameState)
  })
})

const port = process.env.PORT || 3001
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`)
})