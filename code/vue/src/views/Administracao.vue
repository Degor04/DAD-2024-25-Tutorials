<script setup>
import { onMounted, useTemplateRef, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted( () => {
  userStore.fetchUsers()
})

const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

</script>

<template>
  <h1 class="text-5xl pb-8">Admin Dashboard</h1>
    <nav class="flex space-x-1 border-b-2 border-gray-800 text-base">
      <RouterLink
        :to="{ name: 'Users' }"
        class="w-24 h-10 leading-10 text-center rounded-t-xl border-none text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
        activeClass="bg-gray-800 hover:bg-gray-800"
      >
        Users
      </RouterLink>
    </nav>

    <div v-if="userStore.isLoading" class="text-center text-gray-500">Loading users...</div>
    <RouterView></RouterView>
</template>
