<script setup>
import { onMounted } from 'vue'
import UserList from './UserList.vue'
import FilterUsersForm from './UsersFilterForm.vue'
import { useUserStore } from '@/stores/user'
import { useErrorStore } from '@/stores/error'

const storeUser = useUserStore()
const storeError = useErrorStore()

onMounted(() => {
    storeError.resetMessages()
})
</script>

<template>
    <div class="pt-4">
        <FilterUsersForm 
            v-model:filterByBlocked="storeUser.filterByBlocked" 
            v-model:filterByType="storeUser.filterByType">
        </FilterUsersForm>
        <h2 class="pt-8 pb-2 text-2xl">
            {{ storeUser.filterDescription }}
            <span class="text-base">(Total = {{ storeUser.totalFilteredUsers }})</span> 
        </h2>
        <div v-show="storeUser.totalFilteredUsers > 0">
            <UserList :users="storeUser.filteredUsers"></UserList>
        </div>
    </div>
</template>