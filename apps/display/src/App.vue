<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <h1 class="text-4xl font-bold text-center mb-12 text-blue-400">Table Tennis Scoreboard</h1>

      <!-- Game History -->
      <div class="mb-12 overflow-x-auto">
        <div class="inline-flex gap-2 pb-4">
          <div v-for="(frame, index) in gameHistory" :key="index" 
               class="flex-shrink-0 w-24 bg-gray-800/50 border border-gray-700 rounded-xl p-3 backdrop-blur-sm">
            <div class="text-sm text-blue-300 font-medium mb-2">Frame {{ index + 1 }}</div>
            <div class="grid grid-cols-2 gap-2 text-lg font-bold">
              <div :class="frame.player1Win ? 'text-green-400' : 'text-red-400'">
                {{ frame.player1Score }}
              </div>
              <div :class="frame.player2Win ? 'text-green-400' : 'text-red-400'">
                {{ frame.player2Score }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Score -->
      <div class="grid grid-cols-2 gap-12 mb-12">
        <div class="text-center bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
          <h2 class="text-3xl font-bold mb-6 text-blue-300">{{ player1Name }}</h2>
          <div class="text-9xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {{ player1Score }}
          </div>
        </div>
        <div class="text-center bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
          <h2 class="text-3xl font-bold mb-6 text-blue-300">{{ player2Name }}</h2>
          <div class="text-9xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {{ player2Score }}
          </div>
        </div>
      </div>

      <!-- QR Code -->
      <div class="text-center mt-12">
        <div class="inline-block bg-white p-6 rounded-2xl">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Scan to Control</h3>
          <QRCode :value="controlUrl" :size="200" level="H" class="mx-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode.vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

const player1Score = ref(0)
const player2Score = ref(0)
const player1Name = ref('Player 1')
const player2Name = ref('Player 2')
const gameHistory = ref([])

const controlUrl = `${window.location.protocol}//${window.location.hostname}:3000/control`

onMounted(() => {
  socket.on('scoreUpdate', (data) => {
    player1Score.value = data.player1Score
    player2Score.value = data.player2Score
    gameHistory.value = data.gameHistory
  })

  socket.on('playerNames', (data) => {
    player1Name.value = data.player1Name
    player2Name.value = data.player2Name
  })
})
</script>