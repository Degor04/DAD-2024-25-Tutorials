<template>
    <div class="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
      <p class="text-sm text-gray-500">Starting date: {{ game.began_at }}</p>
      <p class="mt-1 text-sm text-gray-500">Board size: {{ game.board_size }}</p>
      <p class="mt-1 text-sm text-gray-500">Status: {{ game.status }}</p>
      <div v-if="game.status != 'E'">
        <p class="mt-1 text-sm text-red-500">Total game time: Game not ended</p>
        <p class="mt-1 text-sm text-red-500">Number of turns played: Game not ended</p>
      </div>
      <div v-else>
        <p class="mt-1 text-sm text-gray-500">Total game time: {{ game.total_time }}</p>
        <p class="mt-1 text-sm text-gray-500">Number of turns played: {{ game.total_turns_winner }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    game: {
      type: Object,
      required: true,
    },
  });
  </script>