<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'


</script>

<template>
    <div class="pt-2">
  <nav class="flex space-x-1 border-b-2 border-gray-800 text-base">
      <RouterLink :to="{ name: 'SinglePlayer'}" class="w-24 h-10 leading-10 text-center rounded-t-xl 
          border-none  text-white select-none cursor-pointer"
          :class="[$route.name === 'SinglePlayer' ? 'bg-gray-800' + ' hover:bg-gray-800' : 'bg-gray-400' + ' hover:bg-gray-500']">
                  SinglePlayer 
      </RouterLink>
      <RouterLink :to="{ name: 'MultiPlayer'}" class="w-24 h-10 leading-10 text-center rounded-t-xl 
          border-none  text-white select-none cursor-pointer"
          :class="[$route.name === 'MultiPlayer' ? 'bg-gray-800' + ' hover:bg-gray-800' : 'bg-gray-400' + ' hover:bg-gray-500']"> 
                  MultiPlayer
      </RouterLink> 
      </nav>
      <RouterView></RouterView>   
    </div>
    
</template>
