<script setup>
import { ref, onMounted, computed } from 'vue';
import NavBar from '../components/common/NavBar.vue';

</script>

<template>
  <div class="min-h-screen bg-green-100 flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold text-center text-green-800 mb-8">
      Welcome
      Glad to see you again
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 w-full max-w-md">
      <button @click="goToSinglePlayer" class="bg-white shadow-lg rounded-lg p-4 text-center font-semibold text-gray-700 hover:bg-gray-100 transition">
        <router-link :to="{name : 'SinglePlayer'}">Play alone</router-link>
      </button>
      <button  class="bg-white shadow-lg rounded-lg p-4 text-center font-semibold text-gray-700 hover:bg-gray-100 transition">
        <router-link :to="{name : 'MultiPlayer'}">Play with a friend</router-link>
      </button>
    </div>
  </div>
</template>
