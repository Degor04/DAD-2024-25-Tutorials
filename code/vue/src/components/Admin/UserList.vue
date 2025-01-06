<script setup>
import { onMounted } from 'vue'
import User from './User.vue'
import { useAuthStore } from '@/stores/auth';

const storeUser = useAuthStore();

const props = defineProps({
    users: Array,
    readonly: Boolean
})

onMounted( () => {
    console.log(props.users)
})

</script>

<template>
    <div class="divide-y divide-solid divide-gray-300 border border-gray-300">
        <User v-for="user in props.users" :key="user" 
                :user="user" 
                :readonly="readonly"></User>
    </div>            
</template>
