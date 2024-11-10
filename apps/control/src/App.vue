<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
    <div class="max-w-md mx-auto bg-gray-800/50 rounded-xl shadow-2xl p-6 backdrop-blur-sm">
      <!-- Header -->
      <h1 class="text-2xl font-bold text-center mb-8 text-blue-400">Table Tennis Control Panel</h1>
      
      <!-- Player Names -->
      <div class="space-y-6 mb-8">
        <div class="relative">
          <label class="block text-sm font-medium text-blue-300 mb-2">Player 1 Name</label>
          <input 
            v-model="player1Name"
            @change="updateNames"
            class="w-full bg-gray-700/50 rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            placeholder="Enter player 1 name"
          >
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-blue-300 mb-2">Player 2 Name</label>
          <input 
            v-model="player2Name"
            @change="updateNames"
            class="w-full bg-gray-700/50 rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            placeholder="Enter player 2 name"
          >
        </div>
      </div>

      <!-- Score Controls -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div class="text-center space-y-4">
          <h2 class="text-xl font-medium text-blue-300">{{ player1Name }}</h2>
          <div class="text-6xl font-bold text-white bg-gray-700/50 rounded-xl py-4">{{ player1Score }}</div>
          <div class="space-y-2">
            <button 
              @click="incrementScore(1)"
              class="w-full bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105"
            >
              +1
            </button>
            <button 
              @click="decrementScore(1)"
              class="w-full bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105"
            >
              -1
            </button>
          </div>
        </div>
        <div class="text-center space-y-4">
          <h2 class="text-xl font-medium text-blue-300">{{ player2Name }}</h2>
          <div class="text-6xl font-bold text-white bg-gray-700/50 rounded-xl py-4">{{ player2Score }}</div>
          <div class="space-y-2">
            <button 
              @click="incrementScore(2)"
              class="w-full bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105"
            >
              +1
            </button>
            <button 
              @click="decrementScore(2)"
              class="w-full bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105"
            >
              -1
            </button>
          </div>
        </div>
      </div>

      <!-- Game Controls -->
      <div class="grid grid-cols-2 gap-4">
        <button 
          @click="newGame"
          class="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105"
        >
          New Game
        </button>
        <button 
          @click="endFrame"
          class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105"
        >
          End Frame
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

const player1Score = ref(0)
const player2Score = ref(0)
const player1Name = ref('Player 1')
const player2Name = ref('Player 2')

const incrementScore = (player: number) => {
  if (player === 1) player1Score.value++
  else player2Score.value++
  emitScore()
}

const decrementScore = (player: number) => {
  if (player === 1 && player1Score.value > 0) player1Score.value--
  else if (player === 2 && player2Score.value > 0) player2Score.value--
  emitScore()
}

const newGame = () => {
  player1Score.value = 0
  player2Score.value = 0
  emitScore()
}

const endFrame = () => {
  socket.emit('endFrame', {
    player1Score: player1Score.value,
    player2Score: player2Score.value
  })
}

const updateNames = () => {
  socket.emit('updateNames', {
    player1Name: player1Name.value,
    player2Name: player2Name.value
  })
}

const emitScore = () => {
  socket.emit('updateScore', {
    player1Score: player1Score.value,
    player2Score: player2Score.value
  })
}
</script>